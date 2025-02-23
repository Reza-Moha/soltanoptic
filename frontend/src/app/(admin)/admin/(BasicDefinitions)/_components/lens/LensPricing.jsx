"use client";
import { useDispatch, useSelector } from "react-redux";
import BasicWrapper from "../BasicWrapper";
import { Field, Form, Formik } from "formik";
import { pricingLensSchema } from "@/validators/admin";
import SelectInput from "@/components/Ui/SelectInput";
import SubmitBtn from "@/components/Ui/SubmitBtn";
import { useEffect, useState, useCallback } from "react";
import Input from "@/components/Ui/Input";
import Table from "@/components/Ui/Table";
import { motion } from "framer-motion";
import { toPersianDigits } from "@/utils";
import { PriceInput } from "@/components/Ui/PriceInput";
import toast from "react-hot-toast";
import { FaTrashCan } from "react-icons/fa6";
import { pricingLens } from "@/redux/slices/lensSlice";

const CreateNewLens = () => {
  const [filteredLensList, setFilteredLensList] = useState([]);
  const [previewList, setPreviewList] = useState([]);
  const dispatch = useDispatch();
  const { lensCategories, lensList } = useSelector((state) => state.lensSlice);
  const lensCategoriesOptions = lensCategories.map(
    ({ id, lensCategoryName }) => ({
      value: id,
      label: lensCategoryName,
    }),
  );
  const filterLensList = useCallback(
    (categoryId) =>
      lensList
        .filter((lens) => lens.LensCategory.id === categoryId)
        .map(({ lensId, lensName }) => ({ value: lensId, label: lensName })),
    [lensList],
  );

  const addToPreview = (group, price, setFieldValue) => {
    if (!group || !price) return;

    if (previewList.some((item) => item.group === group)) {
      toast.error("گروه تکراری است! لطفاً گروه جدیدی وارد کنید.");
      return;
    }

    setPreviewList([...previewList, { group, price }]);
    setFieldValue("group", "");
    setFieldValue("price", "");
  };

  const removeFromPreview = (index) => {
    setPreviewList((prev) => prev.filter((_, i) => i !== index));
  };

  const pricingLensHandler = (values, { resetForm }) => {
    const submissionData = {
      LensCategoryId: values.LensCategoryId,
      LensId: values.LensId,
      pricing: previewList
        .filter((item) => !/\((.*?)\)/.test(item.group))
        .map((item) => ({
          group: item.group,
          price: parseFloat(item.price.replace(/,/g, "")),
        })),
    };
    dispatch(pricingLens(submissionData));
    resetForm();
    setPreviewList([]);
  };

  return (
    <BasicWrapper title="قیمت گذاری عدسی">
      <Formik
        initialValues={{ LensCategoryId: "", LensId: "", group: "", price: "" }}
        onSubmit={pricingLensHandler}
        validationSchema={pricingLensSchema}
      >
        {({ values, handleSubmit, setFieldValue }) => {
          useEffect(() => {
            const filteredList = values.LensCategoryId
              ? filterLensList(values.LensCategoryId)
              : [];
            setFilteredLensList(filteredList);
          }, [values.LensCategoryId, filterLensList]);

          useEffect(() => {
            if (values.LensId) {
              const selectedLens = lensList.find(
                (lens) => lens.lensId === values.LensId,
              );

              if (selectedLens?.LensGroup?.pricing) {
                setPreviewList(
                  selectedLens.LensGroup.pricing.map(({ group, price }) => ({
                    group: `(${group})`,
                    price,
                  })),
                );
              } else {
                setPreviewList([]);
              }
            }
          }, [values.LensId, lensList]);

          return (
            <Form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
              <Field
                name="LensCategoryId"
                component={SelectInput}
                options={lensCategoriesOptions}
                placeholder="دسته بندی عدسی"
                onChange={(option) =>
                  setFieldValue("LensCategoryId", option.value)
                }
              />

              {filteredLensList.length > 0 && (
                <Field
                  name="LensId"
                  component={SelectInput}
                  options={filteredLensList}
                  placeholder="انتخاب عدسی"
                  onChange={(option) => setFieldValue("LensId", option.value)}
                />
              )}

              {values.LensId && (
                <>
                  <div className="col-span-1">
                    <Input
                      label="گروه عدسی"
                      name="group"
                      type="text"
                      onChange={(e) => setFieldValue("group", e.target.value)}
                    />
                  </div>
                  <div className="col-span-1">
                    <PriceInput
                      label="قیمت"
                      name="price"
                      type="text"
                      onChange={(e) => setFieldValue("price", e.target.value)}
                    />
                  </div>
                  <div className="col-span-2 flex items-center justify-center mb-2">
                    <button
                      type="button"
                      className="mt-4 p-2 bg-green-400 text-green-800 text-sm rounded hover:scale-105 transition-all ease-linear duration-300"
                      onClick={() =>
                        addToPreview(values.group, values.price, setFieldValue)
                      }
                    >
                      اضافه کردن
                    </button>
                  </div>
                </>
              )}

              {previewList.length > 0 && (
                <div className="md:col-span-2 p-2 border-t border-secondary-500 mx-16">
                  <h3 className="font-bold w-full text-center">
                    لیست قیمت های اضافه شده:
                  </h3>
                  <Table>
                    <Table.Header>
                      <th>ردیف</th>
                      <th>گروه عدسی</th>
                      <th>قیمت</th>
                      <th>عملیات</th>
                    </Table.Header>
                    <Table.Body>
                      {previewList.map((item, index) => {
                        const isInParentheses = /\((.*?)\)/.test(item.group);

                        return (
                          <motion.tr
                            key={index}
                            className={`${isInParentheses ? "bg-green-50" : ""}`}
                          >
                            <td
                              className={`${isInParentheses ? "text-green-700" : ""}`}
                            >
                              {index + 1}
                            </td>
                            <td
                              className={`${isInParentheses ? "text-green-700" : ""}`}
                            >
                              {item.group}
                            </td>
                            <td
                              className={`${isInParentheses ? "text-green-700" : ""}`}
                            >
                              {toPersianDigits(item.price)}
                            </td>
                            <td>
                              {isInParentheses ? (
                                <h3
                                  className={`${isInParentheses ? "text-green-700 text-xs" : ""}`}
                                >
                                  قبلا اضافه شده
                                </h3>
                              ) : (
                                <FaTrashCan
                                  onClick={() => removeFromPreview(index)}
                                  className="text-rose-500 cursor-pointer hover:scale-125 transition-all ease-in duration-200"
                                />
                              )}
                            </td>
                          </motion.tr>
                        );
                      })}
                    </Table.Body>
                  </Table>
                </div>
              )}

              <div className="md:col-span-2 px-10">
                <SubmitBtn>ثبت</SubmitBtn>
              </div>
            </Form>
          );
        }}
      </Formik>
    </BasicWrapper>
  );
};

export default CreateNewLens;
