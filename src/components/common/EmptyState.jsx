import { empty_box } from "../../assets/images";

const EmptyState = () => {
    return (
        <div className="flex flex-col gap-4 items-center justify-center py-12">
            <img src={empty_box} alt="empty" className="w-20" />
        </div>
    );
};

export default EmptyState;