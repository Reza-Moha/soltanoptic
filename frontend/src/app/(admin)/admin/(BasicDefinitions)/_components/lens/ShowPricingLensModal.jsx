import Modal from "@/components/Ui/Modal";
import Table from "@/components/Ui/Table";
import { toPersianDigits } from "@/utils";
import { motion } from "framer-motion";
import { FaTrashCan } from "react-icons/fa6";
export default function ShowPricingLensModal({ lens, show, onClose }) {
  return (
    <Modal
      title={`ویرایش قیمت های عدسی ${lens.lensName}`}
      onClose={onClose}
      show={show}
    >
      {lens?.LensGroup?.pricing.length > 0 && (
        <div>
          <Table>
            <Table.Header>
              <th>ردیف</th>
              <th>گروه عدسی</th>
              <th>قیمت</th>
              <th>عملیات</th>
            </Table.Header>
            <Table.Body>
              {lens?.LensGroup?.pricing.map((item, index) => (
                <motion.tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.group}</td>
                  <td>{toPersianDigits(item.price)}</td>
                  <td>
                    <FaTrashCan
                      //   onClick={() => removeFromPreview(index)}
                      className="text-rose-500 cursor-pointer hover:scale-125 transition-all ease-in duration-200"
                    />
                  </td>
                </motion.tr>
              ))}
            </Table.Body>
          </Table>
        </div>
      )}
    </Modal>
  );
}
