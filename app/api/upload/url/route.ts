import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { NextResponse } from 'next/server';
import { r2 } from '@/lib/r2';

export async function POST(req: Request) {
    try {
        const { filename, contentType } = await req.json();

        if (!filename || !contentType) {
            return NextResponse.json(
                { error: 'Filename and contentType are required' },
                { status: 400 }
            );
        }

        // 파일 이름이 겹치지 않도록 타임스탬프 추가
        const uniqueFilename = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const key = `uploads/${uniqueFilename}`;

        // R2 업로드를 위한 서명된 URL(Presigned URL) 생성 명령
        const command = new PutObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: key,
            ContentType: contentType,
        });

        // 1시간(3600초) 동안 유효한 업로드 전용 URL 생성
        const uploadUrl = await getSignedUrl(r2, command, { expiresIn: 3600 });

        // 최종적으로 파일이 저장될 외부 접근 가능 URL (버킷이 Public 연동된 경우 사용)
        const publicUrl = `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com/${process.env.R2_BUCKET_NAME}/${key}`;

        return NextResponse.json({ uploadUrl, key, publicUrl });
    } catch (error) {
        console.error('Error generating presigned URL:', error);
        return NextResponse.json(
            { error: 'Failed to generate presigned URL' },
            { status: 500 }
        );
    }
}
