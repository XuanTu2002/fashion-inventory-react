import { Fragment, useRef, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/24/outline";

export default function AddImport({
  addImportModalSetting,
  products,
  handlePageUpdate,
  authContext
}) {
  const [import_, setImport] = useState({
    userID: authContext.user,
    categoryID: "",
    quantity: "",
    unitPrice: "",
    totalPrice: 0,
    importDate: new Date().toISOString().split("T")[0],
  });
  const [open, setOpen] = useState(true);
  const cancelButtonRef = useRef(null);

  // Update total price when quantity or unitPrice changes
  useEffect(() => {
    if (import_.quantity && import_.unitPrice) {
      const total = import_.quantity * import_.unitPrice;
      setImport({ ...import_, totalPrice: total });
    }
  }, [import_.quantity, import_.unitPrice]);

  // Handling Input Change for input fields
  const handleInputChange = (key, value) => {
    setImport({ ...import_, [key]: value });
  };

  // POST Data - Create new import
  const addImport = () => {
    // Validate required fields
    if (!import_.categoryID || !import_.quantity || !import_.unitPrice || !import_.importDate) {
      alert("Vui lòng điền đầy đủ thông tin");
      return;
    }

    const importData = {
      category: import_.categoryID,
      quantity: parseInt(import_.quantity),
      unitPrice: parseFloat(import_.unitPrice),
      totalPrice: parseFloat(import_.totalPrice),
      importDate: import_.importDate,
      user: authContext.user
    };

    fetch("http://localhost:4000/api/import/create", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(importData),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then(err => { throw new Error(err.error || "Lỗi khi tạo phiếu nhập"); });
        }
        return response.json();
      })
      .then((result) => {
        alert("Đã thêm phiếu nhập");
        handlePageUpdate();
        addImportModalSetting();
      })
      .catch((err) => {
        alert(err.message || "Lỗi khi tạo phiếu nhập");
        console.log(err);
      });
  };

  return (
    // Modal
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0 ">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg overflow-y-scroll">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                      <PlusIcon
                        className="h-6 w-6 text-blue-400"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left ">
                      <Dialog.Title
                        as="h3"
                        className="text-lg py-4 font-semibold leading-6 text-gray-900"
                      >
                        Thêm phiếu nhập
                      </Dialog.Title>
                      <form action="#">
                        <div className="grid gap-4 mb-4 sm:grid-cols-2">
                          <div>
                            <label
                              htmlFor="categoryID"
                              className="block mb-2 text-sm font-medium text-gray-900"
                            >
                              Danh mục
                            </label>
                            <select
                              id="categoryID"
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                              name="categoryID"
                              onChange={(e) =>
                                handleInputChange(e.target.name, e.target.value)
                              }
                            >
                              <option value="">Chọn danh mục</option>
                              {products.map((product, index) => (
                                <option key={product._id} value={product._id}>
                                  {product.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label
                              htmlFor="quantity"
                              className="block mb-2 text-sm font-medium text-gray-900"
                            >
                              Số lượng nhập
                            </label>
                            <input
                              type="number"
                              name="quantity"
                              id="quantity"
                              min="1" 
                              max="999"
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                              placeholder="1-999"
                              value={import_.quantity}
                              onChange={(e) =>
                                handleInputChange(e.target.name, e.target.value)
                              }
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="unitPrice"
                              className="block mb-2 text-sm font-medium text-gray-900"
                            >
                              Giá nhập/đơn vị (VNĐ)
                            </label>
                            <input
                              type="number"
                              name="unitPrice"
                              id="unitPrice"
                              min="0"
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                              placeholder="Giá nhập mỗi đơn vị"
                              value={import_.unitPrice}
                              onChange={(e) =>
                                handleInputChange(e.target.name, e.target.value)
                              }
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="totalPrice"
                              className="block mb-2 text-sm font-medium text-gray-900"
                            >
                              Tổng giá trị nhập (VNĐ)
                            </label>
                            <input
                              type="text"
                              name="totalPrice"
                              id="totalPrice"
                              className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                              value={import_.totalPrice.toLocaleString()}
                              readOnly
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="importDate"
                              className="block mb-2 text-sm font-medium text-gray-900"
                            >
                              Ngày nhập
                            </label>
                            <input
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                              type="date"
                              id="importDate"
                              name="importDate"
                              value={import_.importDate}
                              onChange={(e) =>
                                handleInputChange(e.target.name, e.target.value)
                              }
                            />
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                    onClick={addImport}
                  >
                    Thêm phiếu nhập
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={() => addImportModalSetting()}
                    ref={cancelButtonRef}
                  >
                    Hủy
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
