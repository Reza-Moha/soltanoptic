import Table from "@/components/Ui/Table";
import React from "react";
import { IoGlasses } from "react-icons/io5";
export const SelectedFrameTable = ({ selectedFrame }) => {
  return (
    <Table>
      <Table.Header>
        <th className="text-xs">عنوان</th>
        <th className="text-center text-xs">کد</th>
        <th className="text-xs">رنگ</th>
        <th className="text-xs">جنسیت</th>
      </Table.Header>
      <Table.Body>
        <tr>
          <td className="text-xs py-1 px-1 text-center">
            {selectedFrame.name}
          </td>
          <td className="text-xs py-1 px-1 text-center">
            {selectedFrame.serialNumber}
          </td>
          <td className="text-xs py-1 p3-1 text-center">
            <IoGlasses
              size={25}
              style={{ color: `${selectedFrame.FrameColors[0].colorCode}` }}
            />
          </td>
          <td className="text-xs py-1 px-1 text-center">
            {selectedFrame.FrameGender?.gender || ""}
          </td>
        </tr>
      </Table.Body>
    </Table>
  );
};
