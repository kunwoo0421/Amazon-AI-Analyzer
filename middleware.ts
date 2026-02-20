import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
    const basicAuth = req.headers.get('authorization');

    if (basicAuth) {
        const authValue = basicAuth.split(' ')[1];
        const credentials = atob(authValue);
        const [user, pwd] = credentials.split(':');

        // 아이디는 아무거나 입력 가능, 비밀번호는 'withalice.team'
        if (pwd === 'withalice.team') {
            return NextResponse.next();
        }
    }

    return new NextResponse('Authentication required', {
        status: 401,
        headers: {
            'WWW-Authenticate': 'Basic realm="Secure Area"',
        },
    });
}

// API 라우팅 및 정적 파일(이미지 등)을 제외한 모든 페이지에 접속 제한 적용
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
