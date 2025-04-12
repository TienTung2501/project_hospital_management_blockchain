import { NextRequest, NextResponse } from "next/server";
import { handleViewProcessing } from "@/actions/viewProcessing/handleViewProcessing";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json(); // Lấy dữ liệu JSON từ yêu cầu
    // Kiểm tra nếu body thiếu tham số cần thiết
    if (!body.userPrivateKey || !body.ipfsCid) {
      return NextResponse.json({ error: "Thiếu tham số cần thiết trong yêu cầu." }, { status: 400 });
    }
    // Gọi hàm xử lý và lấy kết quả
    const result = await handleViewProcessing(body);

    // Kiểm tra kết quả trả về từ handleViewProcessing
    if (!result.success) {
      return NextResponse.json({ error: result.message || "Lỗi không xác định khi xử lý." }, { status: 400 });
    }

    // Trả về kết quả nếu thành công
    // route.ts
    return NextResponse.json({ success: true, data: result.data }, { status: 200 });

  } catch (error) {
    // Xử lý lỗi nếu có ngoại lệ trong quá trình thực thi
    console.error("Lỗi khi xử lý POST request:", error);
    return NextResponse.json({ error: "Đã xảy ra lỗi khi xử lý yêu cầu." }, { status: 500 });
  }
}
