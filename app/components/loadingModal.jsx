import Link from "next/link";

export default function LoadingModal(props) {
  let base_slug = `/pools/${[props.id]}`;
  
  if (props.fromHome) {
    base_slug = `/home`  
  }

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
        <div className="p-8 border w-96 shadow-lg rounded-md bg-white">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900">Confirming transaction</h3>
            <div className="mt-2 px-7 py-3">
              <p className="text-base break-words text-gray-500 font-medium">{props.msg}</p>
              <p className="text-base text-gray-500 mt-3">Comfirm the transaction on your wallet and wait.</p>
            </div>
            <div className="flex justify-center mt-4">
  
              {/* Navigates back to the base URL - closing the modal */}
              <Link
                href={base_slug}
                className="px-4 py-2 bg-primary text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Close
              </Link>
  
            </div>
          </div>
        </div>
      </div>
    );
  }