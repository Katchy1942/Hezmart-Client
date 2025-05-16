import { Link } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";

const Breadcrumbs = ({ items }) => {
  return (
    <nav className="flex mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => (
          <li key={index}>
            <div className="flex items-center">
              {index > 0 && (
                <FiChevronRight className="flex-shrink-0 h-4 w-4 text-gray-400" />
              )}
              {index < items.length - 1 ? (
                <Link
                  to={item.href}
                  className="ml-2 text-sm font-medium text-gray-500 hover:text-gray-700"
                >
                  {item.name}
                </Link>
              ) : (
                <span className="ml-2 text-sm font-medium text-gray-400">
                  {item.name}
                </span>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;