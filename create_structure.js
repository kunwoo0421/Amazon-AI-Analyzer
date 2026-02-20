const fs = require('fs');
const path = require('path');

const pages = [
    'app/education/trial/quiz/page.tsx',
    'app/community/services/page.tsx',
    'app/community/exchange-rate/page.tsx',
    'app/community/news/page.tsx',
    'app/community/acs/page.tsx',
    'app/community/faq/page.tsx',
    'app/community/qna/page.tsx',
    'app/education/premium/quiz/page.tsx',
    'app/education/premium/dictionary/page.tsx',
    'app/education/premium/tutorial/page.tsx',
    'app/education/premium/info/page.tsx',
    'app/analysis/us/page.tsx',
    'app/analysis/jp/page.tsx',
    'app/analysis/global/page.tsx',
    'app/brand/work-status/page.tsx',
    'app/brand/inventory/page.tsx',
    'app/admin/brand/inventory-update/page.tsx',
    'app/admin/brand/work-update/page.tsx',
    'app/admin/brand/shipment/page.tsx'
];

const placeholderContent = (title) => `
import React from 'react';

export default function Page() {
    return (
        <div className="p-8 space-y-4">
            <h1 className="text-2xl font-bold text-slate-900 capitalize">${title.replace(/-/g, ' ')}</h1>
            <div className="p-12 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                Service/Feature Pending Implementation
            </div>
        </div>
    );
}
`;

pages.forEach(filePath => {
    const fullPath = path.resolve(__dirname, filePath);
    const dir = path.dirname(fullPath);

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    const title = path.basename(path.dirname(filePath));
    const content = placeholderContent(title);

    if (!fs.existsSync(fullPath)) {
        fs.writeFileSync(fullPath, content);
        console.log('Created: ' + filePath);
    } else {
        console.log('Exists: ' + filePath);
    }
});
