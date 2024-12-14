"use client";
import { useState } from "react";
import { createNewRefractiveIndex } from "@/redux/slices/lensSlice";
import { createNewRefractiveIndexSchema } from "@/validators/admin";
import BasicWrapper from "../BasicWrapper";
import { Form, Formik, Field } from "formik";
import Input from "@/components/Ui/Input";
import SubmitBtn from "@/components/Ui/SubmitBtn";
import { useDispatch } from "react-redux";
import { FaRegTrashCan } from "react-icons/fa6";
import { toPersianDigits } from "@/utils";
import { RefractiveIndexList } from "./ListOfRefractiveIndex";

export default function ReflactiveIndex() {
  const dispatch = useDispatch();

  const [characteristicsList, setCharacteristicsList] = useState([]);
  const [newCharacteristic, setNewCharacteristic] = useState("");

  const createNewRefractiveIndexHandler = (values, { resetForm }) => {
    const dataToSend = {
      ...values,
      characteristics: characteristicsList,
    };

    dispatch(createNewRefractiveIndex(dataToSend));
    resetForm();
    setCharacteristicsList([]);
  };

  const addCharacteristic = () => {
    if (newCharacteristic.trim()) {
      setCharacteristicsList([...characteristicsList, newCharacteristic]);
      setNewCharacteristic("");
    }
  };

  const removeCharacteristic = (index) => {
    setCharacteristicsList(characteristicsList.filter((_, i) => i !== index));
  };

  return (
    <BasicWrapper title="تعریف ضریب شکست عدسی">
      <Formik
        initialValues={{ index: "", characteristics: "" }}
        onSubmit={createNewRefractiveIndexHandler}
        validationSchema={createNewRefractiveIndexSchema}
      >
        {({ handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="ضریب شکست عدسی"
                name="index"
                type="text"
                bg="bg-white"
              />
              <Input
                label="ویژگی های شکست عدسی"
                name="characteristics"
                type="text"
                bg="bg-white"
                value={newCharacteristic}
                onChange={(e) => setNewCharacteristic(e.target.value)}
              />
              <div className="flex items-center justify-center">
                <button
                  type="button"
                  onClick={addCharacteristic}
                  className="btn--secondary py-2 rounded px-1 h-10 w-1/2"
                >
                  افزودن ویژگی
                </button>
              </div>
              <div className="md:col-span-3 px-2">
                <ul className="mt-4">
                  {characteristicsList.map((item, index) => (
                    <li
                      key={index}
                      className="flex justify-center items-center w-full md:w-1/2 px-5 py-1 border border-green-200  bg-green-50 text-green-700 rounded-md mb-2 text-xs font-semibold"
                    >
                      <span className="flex-1">
                        {toPersianDigits(item || 0)}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeCharacteristic(index)}
                        className="text-rose-400 hover:bg-red-300 p-1 rounded-full hover:text-slate-800"
                      >
                        <FaRegTrashCan />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="col-span-1 md:col-span-3">
                <SubmitBtn>ایجاد</SubmitBtn>
              </div>
            </div>
          </Form>
        )}
      </Formik>
      <RefractiveIndexList />
    </BasicWrapper>
  );
}
