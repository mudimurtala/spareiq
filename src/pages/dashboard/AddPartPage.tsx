import { Link } from "react-router-dom";

export const AddPartPage = () => {
  return (
    <div className="min-h-screen bg-neutral-50 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-sm">
        <p className="text-sm font-medium text-accent-500 mb-2">Add New Part</p>
        <h1 className="text-2xl sm:text-3xl font-bold text-primary-950">
          Part form coming soon
        </h1>
        <p className="mt-3 text-gray-600">
          This placeholder page will later host the inventory creation form.
        </p>

        <Link
          to="/dashboard/inventory"
          className="mt-6 inline-flex rounded-md bg-accent-500 px-4 py-3 font-bold text-primary-950 transition hover:bg-opacity-90"
        >
          Back to Inventory
        </Link>
      </div>
    </div>
  );
};
