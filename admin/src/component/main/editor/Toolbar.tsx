export default function Toolbar() {
    const handleNew = () => console.log("handleNew");
    const handleSave = () => console.log("handleSave");
    const handleLoad = () => console.log("handleLoad");

    const buttons = [
        { label: "New Project", onClick: handleNew },
        { label: "Save", onClick: handleSave },
        { label: "Load", onClick: handleLoad },
    ];

    return (
        <div className="flex gap-3 p-2 px-3">
            {buttons.map((btn) => (
                <button
                    key={btn.label}
                    onClick={btn.onClick}
                    className="
                        px-[18px] py-[10px] text-[15px] cursor-pointer
                        border border-[#ccc] rounded-[6px] bg-[#f5f5f5]
                        transition-all duration-200
                        hover:bg-[#eaeaea]
                        active:scale-[0.97]
                    "
                >
                    {btn.label}
                </button>
            ))}
        </div>
    );
}