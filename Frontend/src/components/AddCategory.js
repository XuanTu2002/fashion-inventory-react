import { Fragment, useContext, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import AuthContext from "../AuthContext";
import { showSuccessToast, showErrorToast, showWarningToast } from "../components/Toast";

export default function AddCategory({
  addCategoryModalSetting,
  handlePageUpdate,
}) {
  const authContext = useContext(AuthContext);
  const [category, setCategory] = useState({
    user: authContext.user,
    name: "",
    manufacturer: "",
    description: "",
    stock: 0
  });
  const [open, setOpen] = useState(true);
  const cancelButtonRef = useRef(null);

  const handleInputChange = (key, value) => {
    setCategory({ ...category, [key]: value });
  };

  const addCategory = () => {
    // Validate required fields
    if (!category.name) {
      showWarningToast("Vui lòng nhập tên danh mục");
      return;
    }

    fetch("http://localhost:4000/api/category/create", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(category),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then(err => { throw new Error(err.error || "Lỗi khi tạo danh mục"); });
        }
        return response.json();
      })
      .then((result) => {
        showSuccessToast("Đã thêm danh mục thành công");
        handlePageUpdate();
        addCategoryModalSetting();
      })
      .catch((err) => {
        showErrorToast(err.message || "Lỗi khi tạo danh mục");
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
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
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
                        className="text-lg font-semibold leading-6 text-gray-900 "
                      >
                        Thêm danh mục sản phẩm
                      </Dialog.Title>
                      <form action="#">
                        <div className="grid gap-4 mb-4 sm:grid-cols-2">
                          <div>
                            <label
                              htmlFor="name"
                              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                              Name
                            </label>
                            <input
                              type="text"
                              name="name"
                              id="name"
                              value={category.name}
                              onChange={(e) =>
                                handleInputChange(e.target.name, e.target.value)
                              }
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              placeholder="Nhập tên danh mục"
                              required
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="manufacturer"
                              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                              Nhà sản xuất
                            </label>
                            <input
                              type="text"
                              name="manufacturer"
                              id="manufacturer"
                              value={category.manufacturer}
                              onChange={(e) =>
                                handleInputChange(e.target.name, e.target.value)
                              }
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              placeholder="Nhập tên nhà sản xuất"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <label
                              htmlFor="description"
                              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                              Mô tả
                            </label>
                            <textarea
                              rows="3"
                              name="description"
                              id="description"
                              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              placeholder="Nhập mô tả danh mục..."
                              value={category.description}
                              onChange={(e) =>
                                handleInputChange(e.target.name, e.target.value)
                              }
                            ></textarea>
                          </div>
                          <div>
                            <label
                              htmlFor="stock"
                              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                              Số lượng tồn kho
                            </label>
                            <input
                              type="number"
                              name="stock"
                              id="stock"
                              min="0"
                              value={category.stock}
                              onChange={(e) =>
                                handleInputChange(e.target.name, parseInt(e.target.value) || 0)
                              }
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              placeholder="0"
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
                    onClick={addCategory}
                  >
                    Thêm danh mục
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={() => addCategoryModalSetting()}
                    ref={cancelButtonRef}
                  >
                    Hủy bỏ
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
