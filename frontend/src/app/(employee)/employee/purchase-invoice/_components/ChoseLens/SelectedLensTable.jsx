import Table from "@/components/Ui/Table";
import React from "react";
import { IoGlasses } from "react-icons/io5";
import Image from "next/image";
export const SelectedLensTable = ({ selectedLens }) => {
    return (
        <Table>
            <Table.Header>
                <th className="text-xs">عنوان</th>
                <th className="text-center text-xs">نوع</th>
                <th className="text-xs">ضریب شکست</th>
                <th className="text-xs">_</th>
            </Table.Header>
            <Table.Body>
                <tr>
                    <td className="text-xs py-1 px-1 text-center">
                        {selectedLens.lensName}
                    </td>
                    <td className="text-xs py-1 px-1 text-center">
                        {selectedLens.LensType.title}
                    </td>
                    <td className="text-xs py-1 p3-1 text-center">
                        {selectedLens.RefractiveIndex.index}
                    </td>
                    <td className="text-xs py-1 px-1 text-center">
                        <div className="w-6 h-6 relative">
                            <Image
                                className="rounded object-fill"
                                src={`${process.env.NEXT_PUBLIC_API_URL}/${
                                    selectedLens.lensImage || "default-image.jpg"
                                }`}
                                alt={selectedLens.lensName || "تصویر عدسی"}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                onError={(e) =>
                                    (e.target.src = "/fallback-image.jpg")
                                }
                            />
                        </div>
                    </td>
                </tr>
            </Table.Body>
        </Table>
    );
};
