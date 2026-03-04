import React, { useState } from 'react';

const ContactBox: React.FC = () => {
    const [showToast, setShowToast] = useState(false);
    const email = "cektjtro@gmail.com";

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(email);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2000);
        } catch (err) {
            console.error('복사 실패:', err);
        }
    };

    return (
        <div className="w-full my-10 border border-sky-300 rounded-xl bg-white/80 p-10 flex flex-col relative shadow-sm">
            <div className="text-lg font-semibold mb-4 text-slate-800">Contact</div>

            <div className="flex items-center gap-x-3 group w-fit">
                <img src="/rsc/mail_50dp.png" alt="Email" className="w-5 h-5" />

                <span className="text-sky-600 font-medium">{email}</span>

                <button
                    type="button"
                    onClick={copyToClipboard}
                    className="hover:bg-sky-100 p-1.5 rounded-md transition-all active:scale-95 group/btn cursor-pointer"
                    title="이메일 복사"
                >
                    <img src="/rsc/content_copy_50dp.png" alt="Copy" className="w-4 h-4" />
                </button>
            </div>

            <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-6 py-3 rounded-full text-sm shadow-lg transition-all duration-300 z-50 ${showToast ? 'opacity-100 translate-y-0 visible' : 'opacity-0 translate-y-2 invisible'
                }`}>
                이메일 주소가 복사되었습니다! ✨
            </div>
        </div>
    );
};

export default ContactBox;