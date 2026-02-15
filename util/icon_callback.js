const email = document.getElementById('emailText').innerText;
const toast = document.getElementById('toast');

function copyToClipboard() {


    navigator.clipboard.writeText(email).then(() => {
        toast.classList.remove('invisible', 'opacity-0', 'translate-y-2');
        toast.classList.add('opacity-100', 'translate-y-0');

        setTimeout(() => {
            toast.classList.remove('opacity-100', 'translate-y-0');
            toast.classList.add('opacity-0', 'translate-y-2');

            setTimeout(() => {
                toast.classList.add('invisible');
            }, 300);
        }, 2000);
    });
}