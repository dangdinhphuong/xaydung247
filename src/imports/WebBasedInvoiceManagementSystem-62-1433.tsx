import svgPaths from "./svg-91iepiknqj";

function Icon() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p203476e0} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M12.6667 8H3.33333" id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Link() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[36px]" data-name="Link">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon />
      </div>
    </div>
  );
}

function Heading() {
  return (
    <div className="flex-[1_0_0] h-[28px] min-h-px min-w-px relative" data-name="Heading 1">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Inter:Bold',sans-serif] font-bold leading-[28px] not-italic relative shrink-0 text-[#101828] text-[20px] whitespace-nowrap">Trình chỉnh sửa mẫu hóa đơn</p>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="h-[36px] relative shrink-0 w-[325.328px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-center relative size-full">
        <Link />
        <Heading />
      </div>
    </div>
  );
}

function Icon1() {
  return (
    <div className="absolute left-[9px] size-[16px] top-[6.5px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p19d57600} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M2 6H14" id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M6 14V6" id="Vector_3" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function PrimitiveButton() {
  return (
    <div className="bg-white flex-[1_0_0] h-[29px] min-h-px min-w-px relative rounded-[14px]" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon1 />
        <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[52.5px] not-italic text-[#0a0a0a] text-[14px] text-center top-[3.5px] whitespace-nowrap">Visual</p>
      </div>
    </div>
  );
}

function Icon2() {
  return (
    <div className="absolute left-[9px] size-[16px] top-[6.5px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p107b6100} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p27a85e80} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p2fc3a80} id="Vector_3" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function PrimitiveButton1() {
  return (
    <div className="flex-[1_0_0] h-[29px] min-h-px min-w-px relative rounded-[14px]" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon2 />
        <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[52px] not-italic text-[#0a0a0a] text-[14px] text-center top-[3.5px] whitespace-nowrap">HTML</p>
      </div>
    </div>
  );
}

function TabList() {
  return (
    <div className="bg-[#ececf0] flex-[1_0_0] min-h-px min-w-px relative rounded-[14px] w-[165.625px]" data-name="Tab List">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <PrimitiveButton />
        <PrimitiveButton1 />
      </div>
    </div>
  );
}

function PrimitiveDiv() {
  return (
    <div className="flex-[1_0_0] h-[36px] min-h-px min-w-px relative" data-name="Primitive.div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <TabList />
      </div>
    </div>
  );
}

function Icon3() {
  return (
    <div className="absolute left-[11px] size-[16px] top-[8px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p19416e00} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3e059a80} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 12V8" id="Vector_3" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M6 10L8 12L10 10" id="Vector_4" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="bg-white h-[32px] relative rounded-[8px] shrink-0 w-[110.313px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon3 />
        <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[70px] not-italic text-[#0a0a0a] text-[14px] text-center top-[5px] whitespace-nowrap">Xuất PDF</p>
      </div>
    </div>
  );
}

function Icon4() {
  return (
    <div className="absolute left-[10px] size-[16px] top-[8px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p3c401780} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p56b0600} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p17caa400} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-[#1e88e5] h-[32px] relative rounded-[8px] shrink-0 w-[73.75px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon4 />
        <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[52px] not-italic text-[14px] text-center text-white top-[5px] whitespace-nowrap">Lưu</p>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="h-[36px] relative shrink-0 w-[373.688px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
        <PrimitiveDiv />
        <Button />
        <Button1 />
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="bg-white h-[61px] relative shrink-0 w-[1260px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0.1)] border-b border-solid inset-0 pointer-events-none shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between pb-px px-[24px] relative size-full">
        <Container1 />
        <Container2 />
      </div>
    </div>
  );
}

function Heading2() {
  return (
    <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="Heading 3">
      <p className="flex-[1_0_0] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] min-h-px min-w-px not-italic relative text-[#101828] text-[14px]">Thư viện khối</p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[16px] min-h-px min-w-px not-italic relative text-[#6a7282] text-[12px]">Nhấp để thêm</p>
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] h-[40px] items-start relative shrink-0 w-full" data-name="Container">
      <Heading2 />
      <Paragraph />
    </div>
  );
}

function Heading3() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="Heading 4">
      <p className="flex-[1_0_0] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] min-h-px min-w-px not-italic relative text-[#6a7282] text-[12px] uppercase">Đầu trang</p>
    </div>
  );
}

function Icon5() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.pd1f0180} id="Vector" stroke="var(--stroke-0, #1E88E5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p1c197ec0} id="Vector_2" stroke="var(--stroke-0, #1E88E5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M5.83333 5.25H4.66667" id="Vector_3" stroke="var(--stroke-0, #1E88E5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M9.33333 7.58333H4.66667" id="Vector_4" stroke="var(--stroke-0, #1E88E5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M9.33333 9.91667H4.66667" id="Vector_5" stroke="var(--stroke-0, #1E88E5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Container10() {
  return (
    <div className="bg-[#eff6ff] relative rounded-[8px] shrink-0 size-[28px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon5 />
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[16px] min-h-px min-w-px not-italic relative text-[#101828] text-[12px]">Thông tin đơn vị</p>
    </div>
  );
}

function Container13() {
  return (
    <div className="content-stretch flex h-[15px] items-start overflow-clip relative shrink-0 w-full" data-name="Container">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[15px] not-italic relative shrink-0 text-[#6a7282] text-[10px] whitespace-nowrap">Logo, tên, địa chỉ công ty</p>
    </div>
  );
}

function Container11() {
  return (
    <div className="flex-[1_0_0] h-[31px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container12 />
        <Container13 />
      </div>
    </div>
  );
}

function Button2() {
  return (
    <div className="bg-white h-[53px] relative rounded-[10px] shrink-0 w-full" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[11px] pr-[33px] py-px relative size-full">
          <Container10 />
          <Container11 />
        </div>
      </div>
    </div>
  );
}

function Icon6() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.pd1f0180} id="Vector" stroke="var(--stroke-0, #1E88E5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p1c197ec0} id="Vector_2" stroke="var(--stroke-0, #1E88E5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M5.83333 5.25H4.66667" id="Vector_3" stroke="var(--stroke-0, #1E88E5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M9.33333 7.58333H4.66667" id="Vector_4" stroke="var(--stroke-0, #1E88E5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M9.33333 9.91667H4.66667" id="Vector_5" stroke="var(--stroke-0, #1E88E5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Container14() {
  return (
    <div className="bg-[#eff6ff] relative rounded-[8px] shrink-0 size-[28px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon6 />
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[16px] min-h-px min-w-px not-italic relative text-[#101828] text-[12px]">Tiêu đề hóa đơn</p>
    </div>
  );
}

function Container17() {
  return (
    <div className="content-stretch flex h-[15px] items-start overflow-clip relative shrink-0 w-full" data-name="Container">
      <p className="flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[15px] min-h-px min-w-px not-italic relative text-[#6a7282] text-[10px]">HÓA ĐƠN BÁN HÀNG</p>
    </div>
  );
}

function Container15() {
  return (
    <div className="flex-[1_0_0] h-[31px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container16 />
        <Container17 />
      </div>
    </div>
  );
}

function Button3() {
  return (
    <div className="bg-white h-[53px] relative rounded-[10px] shrink-0 w-full" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[11px] pr-[33px] py-px relative size-full">
          <Container14 />
          <Container15 />
        </div>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[114px] items-start relative shrink-0 w-full" data-name="Container">
      <Button2 />
      <Button3 />
    </div>
  );
}

function Container8() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[138px] items-start relative shrink-0 w-full" data-name="Container">
      <Heading3 />
      <Container9 />
    </div>
  );
}

function Heading4() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="Heading 4">
      <p className="flex-[1_0_0] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] min-h-px min-w-px not-italic relative text-[#6a7282] text-[12px] uppercase">Thông tin khách hàng</p>
    </div>
  );
}

function Icon7() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p100e7280} id="Vector" stroke="var(--stroke-0, #1E88E5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p38a00300} id="Vector_2" stroke="var(--stroke-0, #1E88E5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Container20() {
  return (
    <div className="bg-[#eff6ff] relative rounded-[8px] shrink-0 size-[28px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon7 />
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[16px] min-h-px min-w-px not-italic relative text-[#101828] text-[12px]">Thông tin khách</p>
    </div>
  );
}

function Container23() {
  return (
    <div className="content-stretch flex h-[15px] items-start overflow-clip relative shrink-0 w-full" data-name="Container">
      <p className="flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[15px] min-h-px min-w-px not-italic relative text-[#6a7282] text-[10px]">Tên, địa chỉ, điện thoại</p>
    </div>
  );
}

function Container21() {
  return (
    <div className="flex-[1_0_0] h-[31px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container22 />
        <Container23 />
      </div>
    </div>
  );
}

function Button4() {
  return (
    <div className="bg-white h-[53px] relative rounded-[10px] shrink-0 w-full" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[11px] pr-[33px] py-px relative size-full">
          <Container20 />
          <Container21 />
        </div>
      </div>
    </div>
  );
}

function Icon8() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d="M4.66667 1.16667V3.5" id="Vector" stroke="var(--stroke-0, #1E88E5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M9.33333 1.16667V3.5" id="Vector_2" stroke="var(--stroke-0, #1E88E5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p24a2b500} id="Vector_3" stroke="var(--stroke-0, #1E88E5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M1.75 5.83333H12.25" id="Vector_4" stroke="var(--stroke-0, #1E88E5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Container24() {
  return (
    <div className="bg-[#eff6ff] relative rounded-[8px] shrink-0 size-[28px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon8 />
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[16px] min-h-px min-w-px not-italic relative text-[#101828] text-[12px]">Thông tin hóa đơn</p>
    </div>
  );
}

function Container27() {
  return (
    <div className="content-stretch flex h-[15px] items-start overflow-clip relative shrink-0 w-full" data-name="Container">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[15px] not-italic relative shrink-0 text-[#6a7282] text-[10px] whitespace-nowrap">Mã, ngày tạo, hạn thanh toán</p>
    </div>
  );
}

function Container25() {
  return (
    <div className="flex-[1_0_0] h-[31px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container26 />
        <Container27 />
      </div>
    </div>
  );
}

function Button5() {
  return (
    <div className="bg-white h-[53px] relative rounded-[10px] shrink-0 w-full" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[11px] pr-[33px] py-px relative size-full">
          <Container24 />
          <Container25 />
        </div>
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[114px] items-start relative shrink-0 w-full" data-name="Container">
      <Button4 />
      <Button5 />
    </div>
  );
}

function Container18() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[138px] items-start relative shrink-0 w-full" data-name="Container">
      <Heading4 />
      <Container19 />
    </div>
  );
}

function Heading5() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="Heading 4">
      <p className="flex-[1_0_0] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] min-h-px min-w-px not-italic relative text-[#6a7282] text-[12px] uppercase">Bảng mặt hàng</p>
    </div>
  );
}

function Icon9() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d="M7 1.75V12.25" id="Vector" stroke="var(--stroke-0, #1E88E5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.pc71600} id="Vector_2" stroke="var(--stroke-0, #1E88E5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M1.75 5.25H12.25" id="Vector_3" stroke="var(--stroke-0, #1E88E5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M1.75 8.75H12.25" id="Vector_4" stroke="var(--stroke-0, #1E88E5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Container30() {
  return (
    <div className="bg-[#eff6ff] relative rounded-[8px] shrink-0 size-[28px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon9 />
      </div>
    </div>
  );
}

function Container32() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[16px] min-h-px min-w-px not-italic relative text-[#101828] text-[12px]">Bảng mặt hàng</p>
    </div>
  );
}

function Container33() {
  return (
    <div className="content-stretch flex h-[15px] items-start overflow-clip relative shrink-0 w-full" data-name="Container">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[15px] not-italic relative shrink-0 text-[#6a7282] text-[10px] whitespace-nowrap">Danh sách sản phẩm/dịch vụ</p>
    </div>
  );
}

function Container31() {
  return (
    <div className="flex-[1_0_0] h-[31px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container32 />
        <Container33 />
      </div>
    </div>
  );
}

function Button6() {
  return (
    <div className="bg-white h-[53px] relative rounded-[10px] shrink-0 w-full" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[11px] pr-[33px] py-px relative size-full">
          <Container30 />
          <Container31 />
        </div>
      </div>
    </div>
  );
}

function Icon10() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d="M7 1.16667V12.8333" id="Vector" stroke="var(--stroke-0, #1E88E5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p231c2b00} id="Vector_2" stroke="var(--stroke-0, #1E88E5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Container34() {
  return (
    <div className="bg-[#eff6ff] relative rounded-[8px] shrink-0 size-[28px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon10 />
      </div>
    </div>
  );
}

function Container36() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[16px] min-h-px min-w-px not-italic relative text-[#101828] text-[12px]">Tổng tiền</p>
    </div>
  );
}

function Container37() {
  return (
    <div className="content-stretch flex h-[15px] items-start overflow-clip relative shrink-0 w-full" data-name="Container">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[15px] not-italic relative shrink-0 text-[#6a7282] text-[10px] whitespace-nowrap">Tổng cộng, đã thanh toán</p>
    </div>
  );
}

function Container35() {
  return (
    <div className="flex-[1_0_0] h-[31px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container36 />
        <Container37 />
      </div>
    </div>
  );
}

function Button7() {
  return (
    <div className="bg-white h-[53px] relative rounded-[10px] shrink-0 w-full" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[11px] pr-[33px] py-px relative size-full">
          <Container34 />
          <Container35 />
        </div>
      </div>
    </div>
  );
}

function Container29() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[114px] items-start relative shrink-0 w-full" data-name="Container">
      <Button6 />
      <Button7 />
    </div>
  );
}

function Container28() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[138px] items-start relative shrink-0 w-full" data-name="Container">
      <Heading5 />
      <Container29 />
    </div>
  );
}

function Heading6() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="Heading 4">
      <p className="flex-[1_0_0] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] min-h-px min-w-px not-italic relative text-[#6a7282] text-[12px] uppercase">Thông tin thanh toán</p>
    </div>
  );
}

function Icon11() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.pdcd8000} id="Vector" stroke="var(--stroke-0, #1E88E5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M1.16667 5.83333H12.8333" id="Vector_2" stroke="var(--stroke-0, #1E88E5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Container40() {
  return (
    <div className="bg-[#eff6ff] relative rounded-[8px] shrink-0 size-[28px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon11 />
      </div>
    </div>
  );
}

function Container42() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[16px] min-h-px min-w-px not-italic relative text-[#101828] text-[12px]">Thông tin TT</p>
    </div>
  );
}

function Container43() {
  return (
    <div className="content-stretch flex h-[15px] items-start overflow-clip relative shrink-0 w-full" data-name="Container">
      <p className="flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[15px] min-h-px min-w-px not-italic relative text-[#6a7282] text-[10px]">Ngân hàng, QR code</p>
    </div>
  );
}

function Container41() {
  return (
    <div className="flex-[1_0_0] h-[31px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container42 />
        <Container43 />
      </div>
    </div>
  );
}

function Button8() {
  return (
    <div className="bg-white h-[53px] relative rounded-[10px] shrink-0 w-full" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[11px] pr-[33px] py-px relative size-full">
          <Container40 />
          <Container41 />
        </div>
      </div>
    </div>
  );
}

function Icon12() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_62_1541)" id="Icon">
          <path d={svgPaths.p438ccf2} id="Vector" stroke="var(--stroke-0, #1E88E5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p302ff210} id="Vector_2" stroke="var(--stroke-0, #1E88E5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p274cf770} id="Vector_3" stroke="var(--stroke-0, #1E88E5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.pa8eb800} id="Vector_4" stroke="var(--stroke-0, #1E88E5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
        <defs>
          <clipPath id="clip0_62_1541">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container44() {
  return (
    <div className="bg-[#eff6ff] relative rounded-[8px] shrink-0 size-[28px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon12 />
      </div>
    </div>
  );
}

function Container46() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[16px] min-h-px min-w-px not-italic relative text-[#101828] text-[12px]">Chữ ký</p>
    </div>
  );
}

function Container47() {
  return (
    <div className="content-stretch flex h-[15px] items-start overflow-clip relative shrink-0 w-full" data-name="Container">
      <p className="flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[15px] min-h-px min-w-px not-italic relative text-[#6a7282] text-[10px]">{`Người bán & khách hàng`}</p>
    </div>
  );
}

function Container45() {
  return (
    <div className="flex-[1_0_0] h-[31px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container46 />
        <Container47 />
      </div>
    </div>
  );
}

function Button9() {
  return (
    <div className="bg-white h-[53px] relative rounded-[10px] shrink-0 w-full" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[11px] pr-[33px] py-px relative size-full">
          <Container44 />
          <Container45 />
        </div>
      </div>
    </div>
  );
}

function Icon13() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.pff358a0} id="Vector" stroke="var(--stroke-0, #1E88E5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Container48() {
  return (
    <div className="bg-[#eff6ff] relative rounded-[8px] shrink-0 size-[28px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon13 />
      </div>
    </div>
  );
}

function Container50() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[16px] min-h-px min-w-px not-italic relative text-[#101828] text-[12px]">Chân trang</p>
    </div>
  );
}

function Container51() {
  return (
    <div className="content-stretch flex h-[15px] items-start overflow-clip relative shrink-0 w-full" data-name="Container">
      <p className="flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[15px] min-h-px min-w-px not-italic relative text-[#6a7282] text-[10px]">Lời cảm ơn, điều khoản</p>
    </div>
  );
}

function Container49() {
  return (
    <div className="flex-[1_0_0] h-[31px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container50 />
        <Container51 />
      </div>
    </div>
  );
}

function Button10() {
  return (
    <div className="bg-white h-[53px] relative rounded-[10px] shrink-0 w-full" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[11px] pr-[33px] py-px relative size-full">
          <Container48 />
          <Container49 />
        </div>
      </div>
    </div>
  );
}

function Container39() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[175px] items-start relative shrink-0 w-full" data-name="Container">
      <Button8 />
      <Button9 />
      <Button10 />
    </div>
  );
}

function Container38() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[199px] items-start relative shrink-0 w-full" data-name="Container">
      <Heading6 />
      <Container39 />
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex flex-col gap-[20px] h-[673px] items-start relative shrink-0 w-full" data-name="Container">
      <Container8 />
      <Container18 />
      <Container28 />
      <Container38 />
    </div>
  );
}

function Container5() {
  return (
    <div className="h-[761px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col gap-[16px] items-start pt-[16px] px-[16px] relative size-full">
        <Container6 />
        <Container7 />
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="bg-[#f8fafc] h-[776px] relative shrink-0 w-[240px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip pr-px relative rounded-[inherit] size-full">
        <Container5 />
      </div>
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0.1)] border-r border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Heading7() {
  return (
    <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="Heading 3">
      <p className="flex-[1_0_0] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] min-h-px min-w-px not-italic relative text-[#101828] text-[14px]">Cấu trúc mẫu</p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[16px] min-h-px min-w-px not-italic relative text-[#6a7282] text-[12px]">Kéo để sắp xếp</p>
    </div>
  );
}

function Container54() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] h-[40px] items-start relative shrink-0 w-full" data-name="Container">
      <Heading7 />
      <Paragraph1 />
    </div>
  );
}

function Icon14() {
  return (
    <div className="h-[16px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[45.83%_58.33%_45.83%_33.33%]" data-name="Vector">
        <div className="absolute inset-[-50%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.66667 2.66667">
            <path d={svgPaths.p23ccba00} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-3/4 left-[33.33%] right-[58.33%] top-[16.67%]" data-name="Vector">
        <div className="absolute inset-[-50%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.66667 2.66667">
            <path d={svgPaths.p23ccba00} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[16.67%] left-[33.33%] right-[58.33%] top-3/4" data-name="Vector">
        <div className="absolute inset-[-50%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.66667 2.66667">
            <path d={svgPaths.p23ccba00} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[45.83%_33.33%_45.83%_58.33%]" data-name="Vector">
        <div className="absolute inset-[-50%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.66667 2.66667">
            <path d={svgPaths.p23ccba00} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-3/4 left-[58.33%] right-[33.33%] top-[16.67%]" data-name="Vector">
        <div className="absolute inset-[-50%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.66667 2.66667">
            <path d={svgPaths.p23ccba00} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[16.67%] left-[58.33%] right-[33.33%] top-3/4" data-name="Vector">
        <div className="absolute inset-[-50%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.66667 2.66667">
            <path d={svgPaths.p23ccba00} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container57() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Icon14 />
      </div>
    </div>
  );
}

function Icon15() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p19416e00} id="Vector" stroke="var(--stroke-0, #1E88E5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3e059a80} id="Vector_2" stroke="var(--stroke-0, #1E88E5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M6.66667 6H5.33333" id="Vector_3" stroke="var(--stroke-0, #1E88E5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M10.6667 8.66667H5.33333" id="Vector_4" stroke="var(--stroke-0, #1E88E5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M10.6667 11.3333H5.33333" id="Vector_5" stroke="var(--stroke-0, #1E88E5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container58() {
  return (
    <div className="bg-[#eff6ff] relative rounded-[8px] shrink-0 size-[32px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon15 />
      </div>
    </div>
  );
}

function Heading8() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="Heading 4">
      <p className="flex-[1_0_0] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] min-h-px min-w-px not-italic relative text-[#101828] text-[12px]">Tiêu đề hóa đơn</p>
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="content-stretch flex h-[15px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[15px] min-h-px min-w-px not-italic relative text-[#6a7282] text-[10px]">Đang hiển thị</p>
    </div>
  );
}

function Container59() {
  return (
    <div className="flex-[1_0_0] h-[33px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[2px] items-start relative size-full">
        <Heading8 />
        <Paragraph2 />
      </div>
    </div>
  );
}

function Container56() {
  return (
    <div className="h-[33px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex gap-[8px] items-start pr-[66px] relative size-full">
        <Container57 />
        <Container58 />
        <Container59 />
      </div>
    </div>
  );
}

function Jie() {
  return (
    <div className="bg-white h-[59px] relative rounded-[10px] shrink-0 w-full" data-name="Jie">
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="content-stretch flex flex-col items-start pb-px pt-[13px] px-[13px] relative size-full">
        <Container56 />
      </div>
    </div>
  );
}

function Icon16() {
  return (
    <div className="h-[16px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[45.83%_58.33%_45.83%_33.33%]" data-name="Vector">
        <div className="absolute inset-[-50%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.66667 2.66667">
            <path d={svgPaths.p23ccba00} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-3/4 left-[33.33%] right-[58.33%] top-[16.67%]" data-name="Vector">
        <div className="absolute inset-[-50%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.66667 2.66667">
            <path d={svgPaths.p23ccba00} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[16.67%] left-[33.33%] right-[58.33%] top-3/4" data-name="Vector">
        <div className="absolute inset-[-50%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.66667 2.66667">
            <path d={svgPaths.p23ccba00} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[45.83%_33.33%_45.83%_58.33%]" data-name="Vector">
        <div className="absolute inset-[-50%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.66667 2.66667">
            <path d={svgPaths.p23ccba00} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-3/4 left-[58.33%] right-[33.33%] top-[16.67%]" data-name="Vector">
        <div className="absolute inset-[-50%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.66667 2.66667">
            <path d={svgPaths.p23ccba00} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[16.67%] left-[58.33%] right-[33.33%] top-3/4" data-name="Vector">
        <div className="absolute inset-[-50%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.66667 2.66667">
            <path d={svgPaths.p23ccba00} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container61() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Icon16 />
      </div>
    </div>
  );
}

function Icon17() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p19416e00} id="Vector" stroke="var(--stroke-0, #1E88E5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3e059a80} id="Vector_2" stroke="var(--stroke-0, #1E88E5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M6.66667 6H5.33333" id="Vector_3" stroke="var(--stroke-0, #1E88E5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M10.6667 8.66667H5.33333" id="Vector_4" stroke="var(--stroke-0, #1E88E5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M10.6667 11.3333H5.33333" id="Vector_5" stroke="var(--stroke-0, #1E88E5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container62() {
  return (
    <div className="bg-[#eff6ff] relative rounded-[8px] shrink-0 size-[32px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon17 />
      </div>
    </div>
  );
}

function Heading9() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="Heading 4">
      <p className="flex-[1_0_0] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] min-h-px min-w-px not-italic relative text-[#101828] text-[12px]">Thông tin đơn vị</p>
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="content-stretch flex h-[15px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[15px] min-h-px min-w-px not-italic relative text-[#6a7282] text-[10px]">Đang hiển thị</p>
    </div>
  );
}

function Container63() {
  return (
    <div className="flex-[1_0_0] h-[33px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[2px] items-start relative size-full">
        <Heading9 />
        <Paragraph3 />
      </div>
    </div>
  );
}

function Container60() {
  return (
    <div className="h-[33px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex gap-[8px] items-start pr-[66px] relative size-full">
        <Container61 />
        <Container62 />
        <Container63 />
      </div>
    </div>
  );
}

function Jie1() {
  return (
    <div className="bg-white h-[59px] relative rounded-[10px] shrink-0 w-full" data-name="Jie">
      <div aria-hidden="true" className="absolute border border-[#1e88e5] border-solid inset-0 pointer-events-none rounded-[10px] shadow-[0px_0px_0px_0px_rgba(30,136,229,0.2),0px_4px_6px_0px_rgba(0,0,0,0.1),0px_2px_4px_0px_rgba(0,0,0,0.1)]" />
      <div className="content-stretch flex flex-col items-start pb-px pt-[13px] px-[13px] relative size-full">
        <Container60 />
      </div>
    </div>
  );
}

function Icon18() {
  return (
    <div className="h-[16px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[45.83%_58.33%_45.83%_33.33%]" data-name="Vector">
        <div className="absolute inset-[-50%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.66667 2.66667">
            <path d={svgPaths.p23ccba00} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-3/4 left-[33.33%] right-[58.33%] top-[16.67%]" data-name="Vector">
        <div className="absolute inset-[-50%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.66667 2.66667">
            <path d={svgPaths.p23ccba00} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[16.67%] left-[33.33%] right-[58.33%] top-3/4" data-name="Vector">
        <div className="absolute inset-[-50%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.66667 2.66667">
            <path d={svgPaths.p23ccba00} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[45.83%_33.33%_45.83%_58.33%]" data-name="Vector">
        <div className="absolute inset-[-50%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.66667 2.66667">
            <path d={svgPaths.p23ccba00} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-3/4 left-[58.33%] right-[33.33%] top-[16.67%]" data-name="Vector">
        <div className="absolute inset-[-50%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.66667 2.66667">
            <path d={svgPaths.p23ccba00} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[16.67%] left-[58.33%] right-[33.33%] top-3/4" data-name="Vector">
        <div className="absolute inset-[-50%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.66667 2.66667">
            <path d={svgPaths.p23ccba00} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container65() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Icon18 />
      </div>
    </div>
  );
}

function Icon19() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M5.33333 1.33333V4" id="Vector" stroke="var(--stroke-0, #1E88E5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M10.6667 1.33333V4" id="Vector_2" stroke="var(--stroke-0, #1E88E5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3ee34580} id="Vector_3" stroke="var(--stroke-0, #1E88E5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M2 6.66667H14" id="Vector_4" stroke="var(--stroke-0, #1E88E5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container66() {
  return (
    <div className="bg-[#eff6ff] relative rounded-[8px] shrink-0 size-[32px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon19 />
      </div>
    </div>
  );
}

function Heading10() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="Heading 4">
      <p className="flex-[1_0_0] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] min-h-px min-w-px not-italic relative text-[#101828] text-[12px]">Thông tin hóa đơn</p>
    </div>
  );
}

function Paragraph4() {
  return (
    <div className="content-stretch flex h-[15px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[15px] min-h-px min-w-px not-italic relative text-[#6a7282] text-[10px]">Đang hiển thị</p>
    </div>
  );
}

function Container67() {
  return (
    <div className="flex-[1_0_0] h-[33px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[2px] items-start relative size-full">
        <Heading10 />
        <Paragraph4 />
      </div>
    </div>
  );
}

function Container64() {
  return (
    <div className="h-[33px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex gap-[8px] items-start pr-[66px] relative size-full">
        <Container65 />
        <Container66 />
        <Container67 />
      </div>
    </div>
  );
}

function Jie2() {
  return (
    <div className="bg-white h-[59px] relative rounded-[10px] shrink-0 w-full" data-name="Jie">
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="content-stretch flex flex-col items-start pb-px pt-[13px] px-[13px] relative size-full">
        <Container64 />
      </div>
    </div>
  );
}

function Icon20() {
  return (
    <div className="h-[16px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[45.83%_58.33%_45.83%_33.33%]" data-name="Vector">
        <div className="absolute inset-[-50%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.66667 2.66667">
            <path d={svgPaths.p23ccba00} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-3/4 left-[33.33%] right-[58.33%] top-[16.67%]" data-name="Vector">
        <div className="absolute inset-[-50%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.66667 2.66667">
            <path d={svgPaths.p23ccba00} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[16.67%] left-[33.33%] right-[58.33%] top-3/4" data-name="Vector">
        <div className="absolute inset-[-50%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.66667 2.66667">
            <path d={svgPaths.p23ccba00} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[45.83%_33.33%_45.83%_58.33%]" data-name="Vector">
        <div className="absolute inset-[-50%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.66667 2.66667">
            <path d={svgPaths.p23ccba00} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-3/4 left-[58.33%] right-[33.33%] top-[16.67%]" data-name="Vector">
        <div className="absolute inset-[-50%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.66667 2.66667">
            <path d={svgPaths.p23ccba00} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[16.67%] left-[58.33%] right-[33.33%] top-3/4" data-name="Vector">
        <div className="absolute inset-[-50%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.66667 2.66667">
            <path d={svgPaths.p23ccba00} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container69() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Icon20 />
      </div>
    </div>
  );
}

function Icon21() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p399eca00} id="Vector" stroke="var(--stroke-0, #1E88E5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.pc93b400} id="Vector_2" stroke="var(--stroke-0, #1E88E5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container70() {
  return (
    <div className="bg-[#eff6ff] relative rounded-[8px] shrink-0 size-[32px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon21 />
      </div>
    </div>
  );
}

function Heading11() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="Heading 4">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] not-italic relative shrink-0 text-[#101828] text-[12px] whitespace-nowrap">Thông tin khách hàng</p>
    </div>
  );
}

function Paragraph5() {
  return (
    <div className="content-stretch flex h-[15px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[15px] min-h-px min-w-px not-italic relative text-[#6a7282] text-[10px]">Đang hiển thị</p>
    </div>
  );
}

function Container71() {
  return (
    <div className="flex-[1_0_0] h-[33px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[2px] items-start relative size-full">
        <Heading11 />
        <Paragraph5 />
      </div>
    </div>
  );
}

function Container68() {
  return (
    <div className="h-[33px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex gap-[8px] items-start pr-[66px] relative size-full">
        <Container69 />
        <Container70 />
        <Container71 />
      </div>
    </div>
  );
}

function Jie3() {
  return (
    <div className="bg-white h-[59px] relative rounded-[10px] shrink-0 w-full" data-name="Jie">
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="content-stretch flex flex-col items-start pb-px pt-[13px] px-[13px] relative size-full">
        <Container68 />
      </div>
    </div>
  );
}

function Icon22() {
  return (
    <div className="h-[16px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[45.83%_58.33%_45.83%_33.33%]" data-name="Vector">
        <div className="absolute inset-[-50%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.66667 2.66667">
            <path d={svgPaths.p23ccba00} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-3/4 left-[33.33%] right-[58.33%] top-[16.67%]" data-name="Vector">
        <div className="absolute inset-[-50%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.66667 2.66667">
            <path d={svgPaths.p23ccba00} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[16.67%] left-[33.33%] right-[58.33%] top-3/4" data-name="Vector">
        <div className="absolute inset-[-50%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.66667 2.66667">
            <path d={svgPaths.p23ccba00} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[45.83%_33.33%_45.83%_58.33%]" data-name="Vector">
        <div className="absolute inset-[-50%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.66667 2.66667">
            <path d={svgPaths.p23ccba00} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-3/4 left-[58.33%] right-[33.33%] top-[16.67%]" data-name="Vector">
        <div className="absolute inset-[-50%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.66667 2.66667">
            <path d={svgPaths.p23ccba00} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[16.67%] left-[58.33%] right-[33.33%] top-3/4" data-name="Vector">
        <div className="absolute inset-[-50%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.66667 2.66667">
            <path d={svgPaths.p23ccba00} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container73() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Icon22 />
      </div>
    </div>
  );
}

function Icon23() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M8 2V14" id="Vector" stroke="var(--stroke-0, #1E88E5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p19d57600} id="Vector_2" stroke="var(--stroke-0, #1E88E5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M2 6H14" id="Vector_3" stroke="var(--stroke-0, #1E88E5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M2 10H14" id="Vector_4" stroke="var(--stroke-0, #1E88E5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container74() {
  return (
    <div className="bg-[#eff6ff] relative rounded-[8px] shrink-0 size-[32px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon23 />
      </div>
    </div>
  );
}

function Heading12() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="Heading 4">
      <p className="flex-[1_0_0] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] min-h-px min-w-px not-italic relative text-[#101828] text-[12px]">Bảng mặt hàng</p>
    </div>
  );
}

function Paragraph6() {
  return (
    <div className="content-stretch flex h-[15px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[15px] min-h-px min-w-px not-italic relative text-[#6a7282] text-[10px]">Đang hiển thị</p>
    </div>
  );
}

function Container75() {
  return (
    <div className="flex-[1_0_0] h-[33px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[2px] items-start relative size-full">
        <Heading12 />
        <Paragraph6 />
      </div>
    </div>
  );
}

function Container72() {
  return (
    <div className="h-[33px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex gap-[8px] items-start pr-[66px] relative size-full">
        <Container73 />
        <Container74 />
        <Container75 />
      </div>
    </div>
  );
}

function Jie4() {
  return (
    <div className="bg-white h-[59px] relative rounded-[10px] shrink-0 w-full" data-name="Jie">
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="content-stretch flex flex-col items-start pb-px pt-[13px] px-[13px] relative size-full">
        <Container72 />
      </div>
    </div>
  );
}

function Icon24() {
  return (
    <div className="h-[16px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[45.83%_58.33%_45.83%_33.33%]" data-name="Vector">
        <div className="absolute inset-[-50%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.66667 2.66667">
            <path d={svgPaths.p23ccba00} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-3/4 left-[33.33%] right-[58.33%] top-[16.67%]" data-name="Vector">
        <div className="absolute inset-[-50%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.66667 2.66667">
            <path d={svgPaths.p23ccba00} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[16.67%] left-[33.33%] right-[58.33%] top-3/4" data-name="Vector">
        <div className="absolute inset-[-50%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.66667 2.66667">
            <path d={svgPaths.p23ccba00} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[45.83%_33.33%_45.83%_58.33%]" data-name="Vector">
        <div className="absolute inset-[-50%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.66667 2.66667">
            <path d={svgPaths.p23ccba00} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-3/4 left-[58.33%] right-[33.33%] top-[16.67%]" data-name="Vector">
        <div className="absolute inset-[-50%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.66667 2.66667">
            <path d={svgPaths.p23ccba00} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[16.67%] left-[58.33%] right-[33.33%] top-3/4" data-name="Vector">
        <div className="absolute inset-[-50%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.66667 2.66667">
            <path d={svgPaths.p23ccba00} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container77() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Icon24 />
      </div>
    </div>
  );
}

function Icon25() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M8 1.33333V14.6667" id="Vector" stroke="var(--stroke-0, #1E88E5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.pfd86880} id="Vector_2" stroke="var(--stroke-0, #1E88E5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container78() {
  return (
    <div className="bg-[#eff6ff] relative rounded-[8px] shrink-0 size-[32px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon25 />
      </div>
    </div>
  );
}

function Heading13() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="Heading 4">
      <p className="flex-[1_0_0] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] min-h-px min-w-px not-italic relative text-[#101828] text-[12px]">Tổng tiền</p>
    </div>
  );
}

function Paragraph7() {
  return (
    <div className="content-stretch flex h-[15px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[15px] min-h-px min-w-px not-italic relative text-[#6a7282] text-[10px]">Đang hiển thị</p>
    </div>
  );
}

function Container79() {
  return (
    <div className="flex-[1_0_0] h-[33px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[2px] items-start relative size-full">
        <Heading13 />
        <Paragraph7 />
      </div>
    </div>
  );
}

function Container76() {
  return (
    <div className="h-[33px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex gap-[8px] items-start pr-[66px] relative size-full">
        <Container77 />
        <Container78 />
        <Container79 />
      </div>
    </div>
  );
}

function Jie5() {
  return (
    <div className="bg-white h-[59px] relative rounded-[10px] shrink-0 w-full" data-name="Jie">
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="content-stretch flex flex-col items-start pb-px pt-[13px] px-[13px] relative size-full">
        <Container76 />
      </div>
    </div>
  );
}

function Icon26() {
  return (
    <div className="h-[16px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[45.83%_58.33%_45.83%_33.33%]" data-name="Vector">
        <div className="absolute inset-[-50%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.66667 2.66667">
            <path d={svgPaths.p23ccba00} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-3/4 left-[33.33%] right-[58.33%] top-[16.67%]" data-name="Vector">
        <div className="absolute inset-[-50%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.66667 2.66667">
            <path d={svgPaths.p23ccba00} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[16.67%] left-[33.33%] right-[58.33%] top-3/4" data-name="Vector">
        <div className="absolute inset-[-50%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.66667 2.66667">
            <path d={svgPaths.p23ccba00} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[45.83%_33.33%_45.83%_58.33%]" data-name="Vector">
        <div className="absolute inset-[-50%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.66667 2.66667">
            <path d={svgPaths.p23ccba00} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-3/4 left-[58.33%] right-[33.33%] top-[16.67%]" data-name="Vector">
        <div className="absolute inset-[-50%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.66667 2.66667">
            <path d={svgPaths.p23ccba00} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[16.67%] left-[58.33%] right-[33.33%] top-3/4" data-name="Vector">
        <div className="absolute inset-[-50%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.66667 2.66667">
            <path d={svgPaths.p23ccba00} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container81() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Icon26 />
      </div>
    </div>
  );
}

function Icon27() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_62_1522)" id="Icon">
          <path d={svgPaths.p306f2700} id="Vector" stroke="var(--stroke-0, #1E88E5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p6c13900} id="Vector_2" stroke="var(--stroke-0, #1E88E5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.pe811180} id="Vector_3" stroke="var(--stroke-0, #1E88E5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p35126200} id="Vector_4" stroke="var(--stroke-0, #1E88E5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_62_1522">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container82() {
  return (
    <div className="bg-[#eff6ff] relative rounded-[8px] shrink-0 size-[32px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon27 />
      </div>
    </div>
  );
}

function Heading14() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="Heading 4">
      <p className="flex-[1_0_0] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] min-h-px min-w-px not-italic relative text-[#101828] text-[12px]">Chữ ký</p>
    </div>
  );
}

function Paragraph8() {
  return (
    <div className="content-stretch flex h-[15px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[15px] min-h-px min-w-px not-italic relative text-[#6a7282] text-[10px]">Đang hiển thị</p>
    </div>
  );
}

function Container83() {
  return (
    <div className="flex-[1_0_0] h-[33px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[2px] items-start relative size-full">
        <Heading14 />
        <Paragraph8 />
      </div>
    </div>
  );
}

function Container80() {
  return (
    <div className="h-[33px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex gap-[8px] items-start pr-[66px] relative size-full">
        <Container81 />
        <Container82 />
        <Container83 />
      </div>
    </div>
  );
}

function Jie6() {
  return (
    <div className="bg-white h-[59px] relative rounded-[10px] shrink-0 w-full" data-name="Jie">
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="content-stretch flex flex-col items-start pb-px pt-[13px] px-[13px] relative size-full">
        <Container80 />
      </div>
    </div>
  );
}

function Icon28() {
  return (
    <div className="h-[16px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[45.83%_58.33%_45.83%_33.33%]" data-name="Vector">
        <div className="absolute inset-[-50%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.66667 2.66667">
            <path d={svgPaths.p23ccba00} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-3/4 left-[33.33%] right-[58.33%] top-[16.67%]" data-name="Vector">
        <div className="absolute inset-[-50%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.66667 2.66667">
            <path d={svgPaths.p23ccba00} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[16.67%] left-[33.33%] right-[58.33%] top-3/4" data-name="Vector">
        <div className="absolute inset-[-50%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.66667 2.66667">
            <path d={svgPaths.p23ccba00} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[45.83%_33.33%_45.83%_58.33%]" data-name="Vector">
        <div className="absolute inset-[-50%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.66667 2.66667">
            <path d={svgPaths.p23ccba00} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-3/4 left-[58.33%] right-[33.33%] top-[16.67%]" data-name="Vector">
        <div className="absolute inset-[-50%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.66667 2.66667">
            <path d={svgPaths.p23ccba00} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[16.67%] left-[58.33%] right-[33.33%] top-3/4" data-name="Vector">
        <div className="absolute inset-[-50%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.66667 2.66667">
            <path d={svgPaths.p23ccba00} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container85() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Icon28 />
      </div>
    </div>
  );
}

function Icon29() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p1bb15080} id="Vector" stroke="var(--stroke-0, #1E88E5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container86() {
  return (
    <div className="bg-[#eff6ff] relative rounded-[8px] shrink-0 size-[32px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon29 />
      </div>
    </div>
  );
}

function Heading15() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="Heading 4">
      <p className="flex-[1_0_0] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] min-h-px min-w-px not-italic relative text-[#101828] text-[12px]">Chân trang</p>
    </div>
  );
}

function Paragraph9() {
  return (
    <div className="content-stretch flex h-[15px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[15px] min-h-px min-w-px not-italic relative text-[#6a7282] text-[10px]">Đang hiển thị</p>
    </div>
  );
}

function Container87() {
  return (
    <div className="flex-[1_0_0] h-[33px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[2px] items-start relative size-full">
        <Heading15 />
        <Paragraph9 />
      </div>
    </div>
  );
}

function Container84() {
  return (
    <div className="h-[33px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex gap-[8px] items-start pr-[66px] relative size-full">
        <Container85 />
        <Container86 />
        <Container87 />
      </div>
    </div>
  );
}

function Jie7() {
  return (
    <div className="bg-white h-[59px] relative rounded-[10px] shrink-0 w-full" data-name="Jie">
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="content-stretch flex flex-col items-start pb-px pt-[13px] px-[13px] relative size-full">
        <Container84 />
      </div>
    </div>
  );
}

function Container55() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] h-[556px] items-start relative shrink-0 w-full" data-name="Container">
      <Jie />
      <Jie1 />
      <Jie2 />
      <Jie3 />
      <Jie4 />
      <Jie5 />
      <Jie6 />
      <Jie7 />
    </div>
  );
}

function Container53() {
  return (
    <div className="h-[644px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col gap-[16px] items-start pt-[16px] px-[16px] relative size-full">
        <Container54 />
        <Container55 />
      </div>
    </div>
  );
}

function Container52() {
  return (
    <div className="bg-white h-[776px] relative shrink-0 w-[320px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip pr-px relative rounded-[inherit] size-full">
        <Container53 />
      </div>
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0.1)] border-r border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Heading16() {
  return (
    <div className="h-[20px] relative shrink-0 w-[124.328px]" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic relative shrink-0 text-[#101828] text-[14px] whitespace-nowrap">Xem trước trực tiếp</p>
      </div>
    </div>
  );
}

function Icon30() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.pad05c0} id="Vector" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p28db2b80} id="Vector_2" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text() {
  return (
    <div className="flex-[1_0_0] h-[16px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#6a7282] text-[12px] whitespace-nowrap">A4 - Dọc</p>
      </div>
    </div>
  );
}

function Container90() {
  return (
    <div className="h-[16px] relative shrink-0 w-[70.594px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Icon30 />
        <Text />
      </div>
    </div>
  );
}

function Container89() {
  return (
    <div className="content-stretch flex h-[20px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Heading16 />
      <Container90 />
    </div>
  );
}

function Container93() {
  return <div className="absolute bg-[rgba(0,0,0,0.05)] blur-[8px] h-[473.016px] left-[-8px] rounded-[10px] top-[-8px] w-[268.438px]" data-name="Container" />;
}

function Icon31() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p3161fe80} id="Vector" stroke="var(--stroke-0, #155DFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Container98() {
  return (
    <div className="bg-[#dbeafe] relative rounded-[4px] shrink-0 size-[32px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon31 />
      </div>
    </div>
  );
}

function Paragraph10() {
  return (
    <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[20px] min-h-px min-w-px not-italic relative text-[#101828] text-[14px]">A4 - Dọc</p>
    </div>
  );
}

function Paragraph11() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#6a7282] text-[12px] whitespace-nowrap">210mm × 297mm</p>
    </div>
  );
}

function Container99() {
  return (
    <div className="flex-[1_0_0] h-[36px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Paragraph10 />
        <Paragraph11 />
      </div>
    </div>
  );
}

function Container97() {
  return (
    <div className="h-[36px] relative shrink-0 w-[138.953px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
        <Container98 />
        <Container99 />
      </div>
    </div>
  );
}

function Paragraph12() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[16px] min-h-px min-w-px not-italic relative text-[#6a7282] text-[12px] text-right">Lề (TPDT)</p>
    </div>
  );
}

function Paragraph13() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#364153] text-[12px] text-right whitespace-nowrap">20/20/20/20mm</p>
    </div>
  );
}

function Container100() {
  return (
    <div className="h-[32px] relative shrink-0 w-[89.484px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Paragraph12 />
        <Paragraph13 />
      </div>
    </div>
  );
}

function Container96() {
  return (
    <div className="bg-white h-[60px] relative rounded-[10px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[12px] relative size-full">
          <Container97 />
          <Container100 />
        </div>
      </div>
    </div>
  );
}

function Container102() {
  return <div className="absolute border-2 border-[#bedbff] border-dashed h-[357.016px] left-0 top-0 w-[252.438px]" data-name="Container" />;
}

function Container103() {
  return (
    <div className="absolute bg-[#2b7fff] content-stretch flex h-[24px] items-start left-[8px] px-[8px] py-[4px] rounded-[4px] top-[8px] w-[102.406px]" data-name="Container">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap">Vùng an toàn in</p>
    </div>
  );
}

function Heading1() {
  return (
    <div className="h-[72px] relative shrink-0 w-full" data-name="Heading 2">
      <p className="-translate-x-1/2 absolute font-['Inter:Bold',sans-serif] font-bold leading-[36px] left-[86.3px] not-italic text-[#0a0a0a] text-[24px] text-center top-[-1px] w-[171px]">HÓA ĐƠN BÁN HÀNG</p>
    </div>
  );
}

function Paragraph14() {
  return (
    <div className="h-[18px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Inter:Bold',sans-serif] font-bold leading-[18px] left-[86.36px] not-italic text-[#1e88e5] text-[12px] text-center top-0 whitespace-nowrap">HD-001</p>
    </div>
  );
}

function Container106() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[10px] h-[144px] items-start left-[20px] pb-[2px] pt-[17px] top-[40px] w-[172.438px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#1e88e5] border-b-2 border-solid border-t-2 inset-0 pointer-events-none" />
      <Heading1 />
      <Paragraph14 />
    </div>
  );
}

function Heading17() {
  return (
    <div className="h-[108px] relative shrink-0 w-full" data-name="Heading 1">
      <p className="-translate-x-1/2 absolute font-['Inter:Bold',sans-serif] font-bold leading-[36px] left-[86.52px] not-italic text-[#1e88e5] text-[24px] text-center top-[-1px] w-[165px]">CỬA HÀNG VLXD XƯƠNG LUÂN</p>
    </div>
  );
}

function Paragraph15() {
  return (
    <div className="h-[36px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[86.3px] not-italic text-[#0a0a0a] text-[12px] text-center top-0 w-[165px]">123 Đường Võ Văn Tần, Quận 3, TP.HCM</p>
    </div>
  );
}

function Paragraph16() {
  return (
    <div className="h-[36px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[86.53px] not-italic text-[#0a0a0a] text-[12px] text-center top-0 w-[156px]">ĐT: 028 1234 5678 • Email: info@vlxdxuonglan.vn</p>
    </div>
  );
}

function Paragraph17() {
  return (
    <div className="h-[18px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[86.59px] not-italic text-[#0a0a0a] text-[12px] text-center top-0 whitespace-nowrap">MST: 0123456789</p>
    </div>
  );
}

function Container107() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[5px] h-[213px] items-start left-[20px] top-[204px] w-[172.438px]" data-name="Container">
      <Heading17 />
      <Paragraph15 />
      <Paragraph16 />
      <Paragraph17 />
    </div>
  );
}

function Paragraph18() {
  return (
    <div className="absolute h-[36px] left-0 top-0 w-[76.219px]" data-name="Paragraph">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[0] left-0 not-italic text-[#0a0a0a] text-[0px] text-[12px] top-0 w-[68px]">
        <span className="leading-[18px]">Ngày tạo:</span>
        <span className="font-['Inter:Regular',sans-serif] font-normal leading-[18px]">{` 24/02/2026`}</span>
      </p>
    </div>
  );
}

function Paragraph19() {
  return (
    <div className="absolute h-[54px] left-[96.22px] top-0 w-[76.219px]" data-name="Paragraph">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[0] left-0 not-italic text-[#0a0a0a] text-[0px] text-[12px] top-0 w-[68px]">
        <span className="leading-[18px]">Ngày đến hạn:</span>
        <span className="font-['Inter:Regular',sans-serif] font-normal leading-[18px]">{` 26/03/2026`}</span>
      </p>
    </div>
  );
}

function Container108() {
  return (
    <div className="absolute h-[54px] left-[20px] top-[437px] w-[172.438px]" data-name="Container">
      <Paragraph18 />
      <Paragraph19 />
    </div>
  );
}

function Paragraph20() {
  return (
    <div className="h-[18px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[0] left-0 not-italic text-[#0a0a0a] text-[0px] text-[12px] top-0 whitespace-nowrap">
        <span className="leading-[18px]">Khách hàng:</span>
        <span className="font-['Inter:Regular',sans-serif] font-normal leading-[18px]">{` Anh Hòa Q.1`}</span>
      </p>
    </div>
  );
}

function Paragraph21() {
  return (
    <div className="h-[36px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[0] left-0 not-italic text-[#0a0a0a] text-[0px] text-[12px] top-0 w-[151px]">
        <span className="leading-[18px]">Địa chỉ:</span>
        <span className="font-['Inter:Regular',sans-serif] font-normal leading-[18px]">{` 456 Đường Lê Lợi, Quận 1, TP.HCM`}</span>
      </p>
    </div>
  );
}

function Paragraph22() {
  return (
    <div className="h-[18px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[0] left-0 not-italic text-[#0a0a0a] text-[0px] text-[12px] top-0 whitespace-nowrap">
        <span className="leading-[18px]">Điện thoại:</span>
        <span className="font-['Inter:Regular',sans-serif] font-normal leading-[18px]">{` 0901 234 567`}</span>
      </p>
    </div>
  );
}

function Container109() {
  return (
    <div className="absolute content-stretch flex flex-col h-[72px] items-start left-[20px] top-[511px] w-[172.438px]" data-name="Container">
      <Paragraph20 />
      <Paragraph21 />
      <Paragraph22 />
    </div>
  );
}

function HeaderCell() {
  return (
    <div className="absolute border border-[#ddd] border-solid h-[57px] left-0 top-0 w-[44.906px]" data-name="Header Cell">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[18px] left-[9.5px] not-italic text-[12px] text-white top-[18.5px] whitespace-nowrap">STT</p>
    </div>
  );
}

function HeaderCell1() {
  return (
    <div className="absolute border border-[#ddd] border-solid h-[57px] left-[44.91px] top-0 w-[72.266px]" data-name="Header Cell">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[18px] left-[9.5px] not-italic text-[12px] text-white top-[9.5px] w-[30px]">Tên hàng</p>
    </div>
  );
}

function HeaderCell2() {
  return (
    <div className="absolute border border-[#ddd] border-solid h-[57px] left-[117.17px] top-0 w-[49.359px]" data-name="Header Cell">
      <p className="-translate-x-1/2 absolute font-['Inter:Bold',sans-serif] font-bold leading-[18px] left-[23.81px] not-italic text-[12px] text-center text-white top-[18.5px] whitespace-nowrap">ĐVT</p>
    </div>
  );
}

function HeaderCell3() {
  return (
    <div className="absolute border border-[#ddd] border-solid h-[57px] left-[166.53px] top-0 w-[37.578px]" data-name="Header Cell">
      <p className="-translate-x-full absolute font-['Inter:Bold',sans-serif] font-bold leading-[18px] left-[26.41px] not-italic text-[12px] text-right text-white top-[18.5px] whitespace-nowrap">SL</p>
    </div>
  );
}

function HeaderCell4() {
  return (
    <div className="absolute border border-[#ddd] border-solid h-[57px] left-[204.11px] top-0 w-[93.422px]" data-name="Header Cell">
      <p className="-translate-x-full absolute font-['Inter:Bold',sans-serif] font-bold leading-[18px] left-[82.53px] not-italic text-[12px] text-right text-white top-[18.5px] whitespace-nowrap">Đơn giá</p>
    </div>
  );
}

function HeaderCell5() {
  return (
    <div className="absolute border border-[#ddd] border-solid h-[57px] left-[297.53px] top-0 w-[98.047px]" data-name="Header Cell">
      <p className="-translate-x-full absolute font-['Inter:Bold',sans-serif] font-bold leading-[18px] left-[86.77px] not-italic text-[12px] text-right text-white top-[18.5px] whitespace-nowrap">Thành tiền</p>
    </div>
  );
}

function TableRow() {
  return (
    <div className="absolute bg-[#1e88e5] h-[57px] left-0 top-0 w-[395.578px]" data-name="Table Row">
      <HeaderCell />
      <HeaderCell1 />
      <HeaderCell2 />
      <HeaderCell3 />
      <HeaderCell4 />
      <HeaderCell5 />
    </div>
  );
}

function TableHeader() {
  return (
    <div className="absolute h-[57px] left-[0.5px] top-[0.5px] w-[395.578px]" data-name="Table Header">
      <TableRow />
    </div>
  );
}

function TableCell() {
  return (
    <div className="absolute border border-[#ddd] border-solid h-[89px] left-0 top-0 w-[44.906px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[7.5px] not-italic text-[#0a0a0a] text-[12px] top-[34.5px] whitespace-nowrap">1</p>
    </div>
  );
}

function TableCell1() {
  return (
    <div className="absolute border border-[#ddd] border-solid h-[89px] left-[44.91px] top-0 w-[72.266px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[7.5px] not-italic text-[#0a0a0a] text-[12px] top-[7.5px] w-[54px]">Ván nhựa Alcado 20cm x 3m</p>
    </div>
  );
}

function TableCell2() {
  return (
    <div className="absolute border border-[#ddd] border-solid h-[89px] left-[117.17px] top-0 w-[49.359px]" data-name="Table Cell">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[23.66px] not-italic text-[#0a0a0a] text-[12px] text-center top-[34.5px] whitespace-nowrap">Tấm</p>
    </div>
  );
}

function TableCell3() {
  return (
    <div className="absolute border border-[#ddd] border-solid h-[89px] left-[166.53px] top-0 w-[37.578px]" data-name="Table Cell">
      <p className="-translate-x-full absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[28.28px] not-italic text-[#0a0a0a] text-[12px] text-right top-[34.5px] whitespace-nowrap">50</p>
    </div>
  );
}

function TableCell4() {
  return (
    <div className="absolute border border-[#ddd] border-solid h-[89px] left-[204.11px] top-0 w-[93.422px]" data-name="Table Cell">
      <p className="-translate-x-full absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[84.5px] not-italic text-[#0a0a0a] text-[12px] text-right top-[34.5px] whitespace-nowrap">320.000 ₫</p>
    </div>
  );
}

function TableCell5() {
  return (
    <div className="absolute border border-[#ddd] border-solid h-[89px] left-[297.53px] top-0 w-[98.047px]" data-name="Table Cell">
      <p className="-translate-x-full absolute font-['Inter:Bold',sans-serif] font-bold leading-[18px] left-[89.08px] not-italic text-[#0a0a0a] text-[12px] text-right top-[34.5px] whitespace-nowrap">16.000.000 ₫</p>
    </div>
  );
}

function TableRow1() {
  return (
    <div className="absolute h-[89px] left-0 top-0 w-[395.578px]" data-name="Table Row">
      <TableCell />
      <TableCell1 />
      <TableCell2 />
      <TableCell3 />
      <TableCell4 />
      <TableCell5 />
    </div>
  );
}

function TableCell6() {
  return (
    <div className="absolute border border-[#ddd] border-solid h-[107px] left-0 top-0 w-[44.906px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[7.5px] not-italic text-[#0a0a0a] text-[12px] top-[43.5px] whitespace-nowrap">2</p>
    </div>
  );
}

function TableCell7() {
  return (
    <div className="absolute border border-[#ddd] border-solid h-[107px] left-[44.91px] top-0 w-[72.266px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[7.5px] not-italic text-[#0a0a0a] text-[12px] top-[7.5px] w-[56px]">Quần jeans nữ Blue Exchange size M</p>
    </div>
  );
}

function TableCell8() {
  return (
    <div className="absolute border border-[#ddd] border-solid h-[107px] left-[117.17px] top-0 w-[49.359px]" data-name="Table Cell">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[24px] not-italic text-[#0a0a0a] text-[12px] text-center top-[43.5px] whitespace-nowrap">Cái</p>
    </div>
  );
}

function TableCell9() {
  return (
    <div className="absolute border border-[#ddd] border-solid h-[107px] left-[166.53px] top-0 w-[37.578px]" data-name="Table Cell">
      <p className="-translate-x-full absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[28.5px] not-italic text-[#0a0a0a] text-[12px] text-right top-[43.5px] whitespace-nowrap">100</p>
    </div>
  );
}

function TableCell10() {
  return (
    <div className="absolute border border-[#ddd] border-solid h-[107px] left-[204.11px] top-0 w-[93.422px]" data-name="Table Cell">
      <p className="-translate-x-full absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[84.84px] not-italic text-[#0a0a0a] text-[12px] text-right top-[43.5px] whitespace-nowrap">250.000 ₫</p>
    </div>
  );
}

function TableCell11() {
  return (
    <div className="absolute border border-[#ddd] border-solid h-[107px] left-[297.53px] top-0 w-[98.047px]" data-name="Table Cell">
      <p className="-translate-x-full absolute font-['Inter:Bold',sans-serif] font-bold leading-[18px] left-[89.5px] not-italic text-[#0a0a0a] text-[12px] text-right top-[43.5px] whitespace-nowrap">25.000.000 ₫</p>
    </div>
  );
}

function TableRow2() {
  return (
    <div className="absolute h-[107px] left-0 top-[89px] w-[395.578px]" data-name="Table Row">
      <TableCell6 />
      <TableCell7 />
      <TableCell8 />
      <TableCell9 />
      <TableCell10 />
      <TableCell11 />
    </div>
  );
}

function TableCell12() {
  return (
    <div className="absolute border border-[#ddd] border-solid h-[71px] left-0 top-0 w-[44.906px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[7.5px] not-italic text-[#0a0a0a] text-[12px] top-[25.5px] whitespace-nowrap">3</p>
    </div>
  );
}

function TableCell13() {
  return (
    <div className="absolute border border-[#ddd] border-solid h-[71px] left-[44.91px] top-0 w-[72.266px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[7.5px] not-italic text-[#0a0a0a] text-[12px] top-[7.5px] w-[55px]">iPhone 15 Pro Max 256GB</p>
    </div>
  );
}

function TableCell14() {
  return (
    <div className="absolute border border-[#ddd] border-solid h-[71px] left-[117.17px] top-0 w-[49.359px]" data-name="Table Cell">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[24px] not-italic text-[#0a0a0a] text-[12px] text-center top-[25.5px] whitespace-nowrap">Chiếc</p>
    </div>
  );
}

function TableCell15() {
  return (
    <div className="absolute border border-[#ddd] border-solid h-[71px] left-[166.53px] top-0 w-[37.578px]" data-name="Table Cell">
      <p className="-translate-x-full absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[28.81px] not-italic text-[#0a0a0a] text-[12px] text-right top-[25.5px] whitespace-nowrap">2</p>
    </div>
  );
}

function TableCell16() {
  return (
    <div className="absolute border border-[#ddd] border-solid h-[71px] left-[204.11px] top-0 w-[93.422px]" data-name="Table Cell">
      <p className="-translate-x-full absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[84.5px] not-italic text-[#0a0a0a] text-[12px] text-right top-[25.5px] whitespace-nowrap">32.000.000 ₫</p>
    </div>
  );
}

function TableCell17() {
  return (
    <div className="absolute border border-[#ddd] border-solid h-[71px] left-[297.53px] top-0 w-[98.047px]" data-name="Table Cell">
      <p className="-translate-x-full absolute font-['Inter:Bold',sans-serif] font-bold leading-[18px] left-[88.89px] not-italic text-[#0a0a0a] text-[12px] text-right top-[25.5px] whitespace-nowrap">4.200.000 ₫</p>
    </div>
  );
}

function TableRow3() {
  return (
    <div className="absolute h-[71px] left-0 top-[196px] w-[395.578px]" data-name="Table Row">
      <TableCell12 />
      <TableCell13 />
      <TableCell14 />
      <TableCell15 />
      <TableCell16 />
      <TableCell17 />
    </div>
  );
}

function TableBody() {
  return (
    <div className="absolute h-[267px] left-[0.5px] top-[57.5px] w-[395.578px]" data-name="Table Body">
      <TableRow1 />
      <TableRow2 />
      <TableRow3 />
    </div>
  );
}

function Table() {
  return (
    <div className="absolute h-[325px] left-[20px] top-[603px] w-[396.578px]" data-name="Table">
      <TableHeader />
      <TableBody />
    </div>
  );
}

function Text1() {
  return (
    <div className="h-[18px] relative shrink-0 w-[52.031px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-0 not-italic text-[#0a0a0a] text-[12px] top-0 whitespace-nowrap">Tạm tính:</p>
      </div>
    </div>
  );
}

function Text2() {
  return (
    <div className="h-[18px] relative shrink-0 w-[76.266px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-0 not-italic text-[#0a0a0a] text-[12px] top-0 whitespace-nowrap">45.200.000 ₫</p>
      </div>
    </div>
  );
}

function Container112() {
  return (
    <div className="content-stretch flex h-[35px] items-start justify-between pb-px pt-[8px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#ddd] border-b border-solid inset-0 pointer-events-none" />
      <Text1 />
      <Text2 />
    </div>
  );
}

function Text3() {
  return (
    <div className="h-[54px] relative shrink-0 w-[59.891px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[27px] left-0 not-italic text-[#1e88e5] text-[18px] top-px w-[60px]">TỔNG CỘNG:</p>
      </div>
    </div>
  );
}

function Text4() {
  return (
    <div className="h-[54px] relative shrink-0 w-[121.922px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[27px] left-0 not-italic text-[#1e88e5] text-[18px] top-px whitespace-nowrap">45.200.000 ₫</p>
      </div>
    </div>
  );
}

function Container113() {
  return (
    <div className="content-stretch flex h-[72px] items-start justify-between pb-[2px] pt-[8px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#1e88e5] border-b-2 border-solid inset-0 pointer-events-none" />
      <Text3 />
      <Text4 />
    </div>
  );
}

function Text5() {
  return (
    <div className="h-[18px] relative shrink-0 w-[83.172px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-0 not-italic text-[12px] text-[green] top-0 whitespace-nowrap">Đã thanh toán:</p>
      </div>
    </div>
  );
}

function Text6() {
  return (
    <div className="h-[18px] relative shrink-0 w-[76.359px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-0 not-italic text-[12px] text-[green] top-0 whitespace-nowrap">30.000.000 ₫</p>
      </div>
    </div>
  );
}

function Container114() {
  return (
    <div className="content-stretch flex h-[34px] items-start justify-between pt-[8px] relative shrink-0 w-full" data-name="Container">
      <Text5 />
      <Text6 />
    </div>
  );
}

function Text7() {
  return (
    <div className="h-[18px] relative shrink-0 w-[43.703px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[18px] left-0 not-italic text-[12px] text-[orange] top-0 whitespace-nowrap">Còn lại:</p>
      </div>
    </div>
  );
}

function Text8() {
  return (
    <div className="h-[18px] relative shrink-0 w-[79.031px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[18px] left-0 not-italic text-[12px] text-[orange] top-0 whitespace-nowrap">15.200.000 ₫</p>
      </div>
    </div>
  );
}

function Container115() {
  return (
    <div className="content-stretch flex h-[34px] items-start justify-between pt-[8px] relative shrink-0 w-full" data-name="Container">
      <Text7 />
      <Text8 />
    </div>
  );
}

function Container111() {
  return (
    <div className="h-[175px] relative shrink-0 w-[181.813px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container112 />
        <Container113 />
        <Container114 />
        <Container115 />
      </div>
    </div>
  );
}

function Container110() {
  return (
    <div className="absolute content-stretch flex h-[175px] items-start justify-end left-[20px] top-[958px] w-[172.438px]" data-name="Container">
      <Container111 />
    </div>
  );
}

function Paragraph23() {
  return (
    <div className="h-[36px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Inter:Bold',sans-serif] font-bold leading-[18px] left-[33.3px] not-italic text-[#0a0a0a] text-[12px] text-center top-0 w-[61px]">Người bán hàng</p>
    </div>
  );
}

function Paragraph24() {
  return (
    <div className="h-[36px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[33.3px] not-italic text-[#999] text-[12px] text-center top-0 w-[56px]">(Ký và ghi rõ họ tên)</p>
    </div>
  );
}

function Container117() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[60px] h-[132px] items-start left-0 top-0 w-[66.219px]" data-name="Container">
      <Paragraph23 />
      <Paragraph24 />
    </div>
  );
}

function Paragraph25() {
  return (
    <div className="h-[36px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Inter:Bold',sans-serif] font-bold leading-[18px] left-[33.47px] not-italic text-[#0a0a0a] text-[12px] text-center top-0 w-[38px]">Khách hàng</p>
    </div>
  );
}

function Paragraph26() {
  return (
    <div className="h-[36px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[33.3px] not-italic text-[#999] text-[12px] text-center top-0 w-[56px]">(Ký và ghi rõ họ tên)</p>
    </div>
  );
}

function Container118() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[60px] h-[132px] items-start left-[106.22px] top-0 w-[66.219px]" data-name="Container">
      <Paragraph25 />
      <Paragraph26 />
    </div>
  );
}

function Container116() {
  return (
    <div className="absolute h-[132px] left-[20px] top-[1183px] w-[172.438px]" data-name="Container">
      <Container117 />
      <Container118 />
    </div>
  );
}

function Paragraph27() {
  return (
    <div className="absolute h-[54px] left-[20px] top-[1345px] w-[172.438px]" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Inter:Italic',sans-serif] font-normal italic leading-[18px] left-[86.28px] text-[#666] text-[12px] text-center top-0 w-[165px]">Cảm ơn quý khách đã tin tưởng sử dụng sản phẩm của chúng tôi!</p>
    </div>
  );
}

function Container105() {
  return (
    <div className="h-[1419px] relative shrink-0 w-full" data-name="Container">
      <Container106 />
      <Container107 />
      <Container108 />
      <Container109 />
      <Table />
      <Container110 />
      <Container116 />
      <Paragraph27 />
    </div>
  );
}

function Container104() {
  return (
    <div className="absolute content-stretch flex flex-col h-[357.016px] items-start left-0 overflow-clip pt-[20px] px-[20px] top-0 w-[252.438px]" data-name="Container">
      <Container105 />
    </div>
  );
}

function Container101() {
  return (
    <div className="bg-white h-[357.016px] relative shadow-[0px_25px_50px_0px_rgba(0,0,0,0.25)] shrink-0 w-full" data-name="Container">
      <Container102 />
      <Container103 />
      <Container104 />
    </div>
  );
}

function Container121() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[12px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-2 border-[#bedbff] border-dashed inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Text9() {
  return (
    <div className="flex-[1_0_0] h-[16px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#4a5565] text-[12px] whitespace-nowrap">Lề trang</p>
      </div>
    </div>
  );
}

function Container120() {
  return (
    <div className="h-[16px] relative shrink-0 w-[59.422px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center relative size-full">
        <Container121 />
        <Text9 />
      </div>
    </div>
  );
}

function Container123() {
  return <div className="bg-white rounded-[4px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] shrink-0 size-[12px]" data-name="Container" />;
}

function Text10() {
  return (
    <div className="flex-[1_0_0] h-[16px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#4a5565] text-[12px] whitespace-nowrap">Vùng in</p>
      </div>
    </div>
  );
}

function Container122() {
  return (
    <div className="h-[16px] relative shrink-0 w-[57.094px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center relative size-full">
        <Container123 />
        <Text10 />
      </div>
    </div>
  );
}

function Container119() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex gap-[16px] items-center justify-center pr-[0.016px] relative size-full">
          <Container120 />
          <Container122 />
        </div>
      </div>
    </div>
  );
}

function Container95() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[12px] h-[457.016px] items-start left-0 top-0 w-[252.438px]" data-name="Container">
      <Container96 />
      <Container101 />
      <Container119 />
    </div>
  );
}

function Np() {
  return (
    <div className="absolute h-[457.016px] left-0 top-0 w-[252.438px]" data-name="NP">
      <Container95 />
    </div>
  );
}

function Container124() {
  return <div className="absolute border border-[#8ec5ff] border-dashed h-[305.859px] left-[75.58px] opacity-30 top-[75.58px] w-[101.281px]" data-name="Container" />;
}

function Container94() {
  return (
    <div className="absolute bg-white h-[457.016px] left-0 shadow-[0px_20px_25px_0px_rgba(0,0,0,0.1),0px_8px_10px_0px_rgba(0,0,0,0.1)] top-0 w-[252.438px]" data-name="Container">
      <Np />
      <Container124 />
    </div>
  );
}

function Container92() {
  return (
    <div className="absolute h-[457.016px] left-[41.78px] top-0 w-[252.438px]" data-name="Container">
      <Container93 />
      <Container94 />
    </div>
  );
}

function Container91() {
  return (
    <div className="h-[457.016px] relative shrink-0 w-full" data-name="Container">
      <Container92 />
    </div>
  );
}

function Container88() {
  return (
    <div className="bg-[#f3f4f6] flex-[1_0_0] h-[776px] min-h-px min-w-px relative" data-name="Container">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[16px] items-start pt-[32px] px-[32px] relative size-full">
          <Container89 />
          <Container91 />
        </div>
      </div>
    </div>
  );
}

function Heading18() {
  return (
    <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="Heading 3">
      <p className="flex-[1_0_0] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] min-h-px min-w-px not-italic relative text-[#101828] text-[14px]">Cài đặt khối</p>
    </div>
  );
}

function Paragraph28() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[16px] min-h-px min-w-px not-italic relative text-[#6a7282] text-[12px]">Tùy chỉnh hiển thị</p>
    </div>
  );
}

function Container127() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] h-[40px] items-start relative shrink-0 w-full" data-name="Container">
      <Heading18 />
      <Paragraph28 />
    </div>
  );
}

function PrimitiveLabel() {
  return (
    <div className="content-stretch flex h-[16px] items-center relative shrink-0 w-full" data-name="Primitive.label">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] not-italic relative shrink-0 text-[#364153] text-[12px] whitespace-nowrap">Hiển thị</p>
    </div>
  );
}

function Text11() {
  return (
    <div className="h-[16px] relative shrink-0 w-[89.516px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#101828] text-[12px] whitespace-nowrap">Hiển thị khối này</p>
      </div>
    </div>
  );
}

function PrimitiveSpan() {
  return <div className="bg-white rounded-[33554400px] shrink-0 size-[16px]" data-name="Primitive.span" />;
}

function PrimitiveButton2() {
  return (
    <div className="bg-[#030213] h-[18.391px] relative rounded-[33554400px] shrink-0 w-[32px]" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[33554400px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center pl-[15px] pr-px py-px relative size-full">
        <PrimitiveSpan />
      </div>
    </div>
  );
}

function Container130() {
  return (
    <div className="bg-[#f9fafb] h-[40.391px] relative rounded-[10px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[11px] py-px relative size-full">
          <Text11 />
          <PrimitiveButton2 />
        </div>
      </div>
    </div>
  );
}

function Container129() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[64.391px] items-start relative shrink-0 w-full" data-name="Container">
      <PrimitiveLabel />
      <Container130 />
    </div>
  );
}

function PrimitiveLabel1() {
  return (
    <div className="content-stretch flex h-[16px] items-center relative shrink-0 w-full" data-name="Primitive.label">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] not-italic relative shrink-0 text-[#364153] text-[12px] whitespace-nowrap">Bố cục</p>
    </div>
  );
}

function PrimitiveSpan1() {
  return (
    <div className="h-[16px] relative shrink-0 w-[54.844px]" data-name="Primitive.span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center overflow-clip relative rounded-[inherit] size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#0a0a0a] text-[12px] text-center whitespace-nowrap">Logo giữa</p>
      </div>
    </div>
  );
}

function Icon32() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon" opacity="0.5">
          <path d="M4 6L8 10L12 6" id="Vector" stroke="var(--stroke-0, #717182)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function PrimitiveButton3() {
  return (
    <div className="bg-[#f3f3f5] h-[36px] relative rounded-[8px] shrink-0 w-full" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[13px] py-px relative size-full">
          <PrimitiveSpan1 />
          <Icon32 />
        </div>
      </div>
    </div>
  );
}

function Text12() {
  return (
    <div className="h-[16px] relative shrink-0 w-[68.875px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#101828] text-[12px] whitespace-nowrap">Hiển thị logo</p>
      </div>
    </div>
  );
}

function PrimitiveSpan2() {
  return <div className="bg-white rounded-[33554400px] shrink-0 size-[16px]" data-name="Primitive.span" />;
}

function PrimitiveButton4() {
  return (
    <div className="bg-[#cbced4] h-[18.391px] relative rounded-[33554400px] shrink-0 w-[32px]" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[33554400px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center p-px relative size-full">
        <PrimitiveSpan2 />
      </div>
    </div>
  );
}

function Container133() {
  return (
    <div className="bg-[#f9fafb] h-[40.391px] relative rounded-[10px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[11px] py-px relative size-full">
          <Text12 />
          <PrimitiveButton4 />
        </div>
      </div>
    </div>
  );
}

function Text13() {
  return (
    <div className="h-[16px] relative shrink-0 w-[104.844px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#101828] text-[12px] whitespace-nowrap">Hiển thị tên công ty</p>
      </div>
    </div>
  );
}

function PrimitiveSpan3() {
  return <div className="bg-white rounded-[33554400px] shrink-0 size-[16px]" data-name="Primitive.span" />;
}

function PrimitiveButton5() {
  return (
    <div className="bg-[#030213] h-[18.391px] relative rounded-[33554400px] shrink-0 w-[32px]" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[33554400px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center pl-[15px] pr-px py-px relative size-full">
        <PrimitiveSpan3 />
      </div>
    </div>
  );
}

function Container134() {
  return (
    <div className="bg-[#f9fafb] h-[40.391px] relative rounded-[10px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[11px] py-px relative size-full">
          <Text13 />
          <PrimitiveButton5 />
        </div>
      </div>
    </div>
  );
}

function Text14() {
  return (
    <div className="h-[16px] relative shrink-0 w-[79.438px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#101828] text-[12px] whitespace-nowrap">Hiển thị địa chỉ</p>
      </div>
    </div>
  );
}

function PrimitiveSpan4() {
  return <div className="bg-white rounded-[33554400px] shrink-0 size-[16px]" data-name="Primitive.span" />;
}

function PrimitiveButton6() {
  return (
    <div className="bg-[#030213] h-[18.391px] relative rounded-[33554400px] shrink-0 w-[32px]" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[33554400px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center pl-[15px] pr-px py-px relative size-full">
        <PrimitiveSpan4 />
      </div>
    </div>
  );
}

function Container135() {
  return (
    <div className="bg-[#f9fafb] h-[40.391px] relative rounded-[10px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[11px] py-px relative size-full">
          <Text14 />
          <PrimitiveButton6 />
        </div>
      </div>
    </div>
  );
}

function Container132() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] h-[133.172px] items-start relative shrink-0 w-full" data-name="Container">
      <Container133 />
      <Container134 />
      <Container135 />
    </div>
  );
}

function Container131() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[201.172px] items-start relative shrink-0 w-full" data-name="Container">
      <PrimitiveLabel1 />
      <PrimitiveButton3 />
      <Container132 />
    </div>
  );
}

function Container128() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] h-[281.563px] items-start relative shrink-0 w-full" data-name="Container">
      <Container129 />
      <Container131 />
    </div>
  );
}

function Container126() {
  return (
    <div className="h-[369.563px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col gap-[16px] items-start pt-[16px] px-[16px] relative size-full">
        <Container127 />
        <Container128 />
      </div>
    </div>
  );
}

function Container125() {
  return (
    <div className="bg-white h-[776px] relative shrink-0 w-[300px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip pl-px relative rounded-[inherit] size-full">
        <Container126 />
      </div>
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0.1)] border-l border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Container3() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[1260px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start overflow-clip relative rounded-[inherit] size-full">
        <Container4 />
        <Container52 />
        <Container88 />
        <Container125 />
      </div>
    </div>
  );
}

function Icon33() {
  return (
    <div className="absolute left-[554.77px] size-[16px] top-[8px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M13.3333 4.66667H7.33333" id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M9.33333 11.3333H3.33333" id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p2badb400} id="Vector_3" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p79fe00} id="Vector_4" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Icon34() {
  return (
    <div className="absolute left-[689.23px] size-[16px] top-[8px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M4 6L8 10L12 6" id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button11() {
  return (
    <div className="h-[32px] relative shrink-0 w-full" data-name="Button">
      <Icon33 />
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[629.77px] not-italic text-[#0a0a0a] text-[14px] text-center top-[5px] whitespace-nowrap">Cài đặt khổ giấy</p>
      <Icon34 />
    </div>
  );
}

function Container136() {
  return (
    <div className="bg-white h-[33px] relative shrink-0 w-[1260px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0.1)] border-solid border-t inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-px relative size-full">
        <Button11 />
      </div>
    </div>
  );
}

function Eoe() {
  return (
    <div className="absolute bg-[#f8fafc] content-stretch flex flex-col h-[870px] items-start left-[280px] top-[88px] w-[1260px]" data-name="eoe">
      <Container />
      <Container3 />
      <Container136 />
    </div>
  );
}

function Section() {
  return <div className="absolute h-0 left-0 top-[982px] w-[1564px]" data-name="Section" />;
}

function Gf() {
  return (
    <div className="bg-[#f9fafb] h-[982px] relative shrink-0 w-full" data-name="GF">
      <Eoe />
      <Section />
    </div>
  );
}

function Body() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[870px] items-start left-0 top-0 w-[1564px]" data-name="Body">
      <Gf />
    </div>
  );
}

function Re() {
  return (
    <div className="absolute bg-[#f3f3f5] h-[36px] left-0 rounded-[8px] top-0 w-[384px]" data-name="Re">
      <div className="content-stretch flex items-center overflow-clip pl-[40px] pr-[12px] py-[4px] relative rounded-[inherit] size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#717182] text-[14px] whitespace-nowrap">Tìm kiếm hóa đơn, khách hàng...</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Icon35() {
  return (
    <div className="absolute left-[12px] size-[16px] top-[10px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p107a080} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M14 14L11.1333 11.1333" id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container139() {
  return (
    <div className="absolute h-[36px] left-0 top-0 w-[384px]" data-name="Container">
      <Re />
      <Icon35 />
    </div>
  );
}

function Container138() {
  return (
    <div className="flex-[1_0_0] h-[36px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container139 />
      </div>
    </div>
  );
}

function Icon36() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p399eca00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.pc93b400} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function UF1() {
  return (
    <div className="bg-[#1e88e5] relative rounded-[33554400px] shrink-0 size-[32px]" data-name="uF">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon36 />
      </div>
    </div>
  );
}

function Container141() {
  return (
    <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[#0a0a0a] text-[14px] whitespace-nowrap">Nguyễn Văn An</p>
    </div>
  );
}

function Container142() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[16px] min-h-px min-w-px not-italic relative text-[#6a7282] text-[12px]">Quản trị viên</p>
    </div>
  );
}

function UF2() {
  return (
    <div className="h-[36px] relative shrink-0 w-[98.875px]" data-name="uF">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container141 />
        <Container142 />
      </div>
    </div>
  );
}

function Button12() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[36px] items-center justify-center left-[52px] rounded-[8px] top-0 w-[170.875px]" data-name="Button">
      <UF1 />
      <UF2 />
    </div>
  );
}

function Icon37() {
  return (
    <div className="absolute left-[10px] size-[16px] top-[10px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p1ce3c700} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1a06de00} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text15() {
  return <div className="absolute bg-[#ff6467] left-[-3.97px] opacity-1 rounded-[33554400px] size-[15.949px] top-[-3.97px]" data-name="Text" />;
}

function Text16() {
  return <div className="absolute bg-[#fb2c36] left-0 rounded-[33554400px] size-[8px] top-0" data-name="Text" />;
}

function UF3() {
  return (
    <div className="absolute left-[24px] size-[8px] top-[4px]" data-name="uF">
      <Text15 />
      <Text16 />
    </div>
  );
}

function Button13() {
  return (
    <div className="absolute left-0 rounded-[8px] size-[36px] top-0" data-name="Button">
      <Icon37 />
      <UF3 />
    </div>
  );
}

function Container140() {
  return (
    <div className="h-[36px] relative shrink-0 w-[222.875px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Button12 />
        <Button13 />
      </div>
    </div>
  );
}

function Container137() {
  return (
    <div className="h-[63px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[24px] relative size-full">
          <Container138 />
          <Container140 />
        </div>
      </div>
    </div>
  );
}

function UF() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[64px] items-start left-[256px] pb-px top-0 w-[1308px]" data-name="uF">
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0.1)] border-b border-solid inset-0 pointer-events-none" />
      <Container137 />
    </div>
  );
}

function Icon38() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d={svgPaths.pb47f400} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p17a13100} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M10 9H8" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M16 13H8" id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M16 17H8" id="Vector_5" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Container145() {
  return (
    <div className="bg-[#1e88e5] relative rounded-[10px] shrink-0 size-[40px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon38 />
      </div>
    </div>
  );
}

function Heading19() {
  return (
    <div className="h-[36px] relative shrink-0 w-full" data-name="Heading 1">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[36px] left-0 not-italic text-[#101828] text-[24px] top-[-2px] whitespace-nowrap">Invoice Pro</p>
    </div>
  );
}

function Paragraph29() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[16px] min-h-px min-w-px not-italic relative text-[#6a7282] text-[12px]">Quản lý hóa đơn</p>
    </div>
  );
}

function Container146() {
  return (
    <div className="flex-[1_0_0] h-[52px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Heading19 />
        <Paragraph29 />
      </div>
    </div>
  );
}

function Container144() {
  return (
    <div className="h-[52px] relative shrink-0 w-[169.266px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Container145 />
        <Container146 />
      </div>
    </div>
  );
}

function Container143() {
  return (
    <div className="absolute content-stretch flex h-[64px] items-center justify-between left-0 pb-px pl-[24px] pr-[61.734px] top-0 w-[255px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0.1)] border-b border-solid inset-0 pointer-events-none" />
      <Container144 />
    </div>
  );
}

function Icon39() {
  return (
    <div className="absolute left-[16px] size-[20px] top-[12px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p1fc96a00} id="Vector" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p33089d00} id="Vector_2" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p49cfa80} id="Vector_3" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p1cfbf300} id="Vector_4" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Link1() {
  return (
    <div className="h-[44px] relative rounded-[10px] shrink-0 w-[223px]" data-name="Link">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon39 />
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[48px] not-italic text-[#364153] text-[14px] top-[11px] whitespace-nowrap">Dashboard</p>
      </div>
    </div>
  );
}

function Icon40() {
  return (
    <div className="absolute left-[16px] size-[20px] top-[12px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p3713e00} id="Vector" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.pd2076c0} id="Vector_2" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M8.33333 7.5H6.66667" id="Vector_3" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M13.3333 10.8333H6.66667" id="Vector_4" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M13.3333 14.1667H6.66667" id="Vector_5" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Link2() {
  return (
    <div className="h-[44px] relative rounded-[10px] shrink-0 w-[223px]" data-name="Link">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon40 />
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[48px] not-italic text-[#364153] text-[14px] top-[11px] whitespace-nowrap">Hóa đơn</p>
      </div>
    </div>
  );
}

function Icon41() {
  return (
    <div className="absolute left-[16px] size-[20px] top-[12px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p3713e00} id="Vector" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.pd2076c0} id="Vector_2" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p12751280} id="Vector_3" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Link3() {
  return (
    <div className="h-[44px] relative rounded-[10px] shrink-0 w-[223px]" data-name="Link">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon41 />
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[48px] not-italic text-[#364153] text-[14px] top-[11px] whitespace-nowrap">Báo giá</p>
      </div>
    </div>
  );
}

function Icon42() {
  return (
    <div className="absolute left-[16px] size-[20px] top-[12px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p16dd5f0} id="Vector" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M1.66667 8.33333H18.3333" id="Vector_2" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Link4() {
  return (
    <div className="h-[44px] relative rounded-[10px] shrink-0 w-[223px]" data-name="Link">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon42 />
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[48px] not-italic text-[#364153] text-[14px] top-[11px] whitespace-nowrap">Công nợ</p>
      </div>
    </div>
  );
}

function Icon43() {
  return (
    <div className="absolute left-[16px] size-[20px] top-[12px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p25397b80} id="Vector" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p2c4f400} id="Vector_2" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p2241fff0} id="Vector_3" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.pae3c380} id="Vector_4" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Link5() {
  return (
    <div className="h-[44px] relative rounded-[10px] shrink-0 w-[223px]" data-name="Link">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon43 />
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[48px] not-italic text-[#364153] text-[14px] top-[11px] whitespace-nowrap">Khách hàng</p>
      </div>
    </div>
  );
}

function Icon44() {
  return (
    <div className="absolute left-[16px] size-[20px] top-[12px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p20f4ecf0} id="Vector" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M10 18.3333V10" id="Vector_2" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p2eca8c80} id="Vector_3" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M6.25 3.55833L13.75 7.85" id="Vector_4" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Link6() {
  return (
    <div className="h-[44px] relative rounded-[10px] shrink-0 w-[223px]" data-name="Link">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon44 />
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[48px] not-italic text-[#364153] text-[14px] top-[11px] whitespace-nowrap">Mặt hàng</p>
      </div>
    </div>
  );
}

function Icon45() {
  return (
    <div className="absolute left-[16px] size-[20px] top-[12px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p140c1100} id="Vector" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M15 14.1667V7.5" id="Vector_2" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M10.8333 14.1667V4.16667" id="Vector_3" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M6.66667 14.1667V11.6667" id="Vector_4" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Link7() {
  return (
    <div className="h-[44px] relative rounded-[10px] shrink-0 w-[223px]" data-name="Link">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon45 />
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[48px] not-italic text-[#364153] text-[14px] top-[11px] whitespace-nowrap">Báo cáo</p>
      </div>
    </div>
  );
}

function Icon46() {
  return (
    <div className="absolute left-[16px] size-[20px] top-[12px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.ped54800} id="Vector" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p3b27f100} id="Vector_2" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Link8() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative rounded-[10px] w-[223px]" data-name="Link">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon46 />
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[48px] not-italic text-[#364153] text-[14px] top-[11px] whitespace-nowrap">Cài đặt</p>
      </div>
    </div>
  );
}

function Navigation() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] h-[412px] items-start left-0 pl-[16px] py-[16px] top-[64px] w-[255px]" data-name="Navigation">
      <Link1 />
      <Link2 />
      <Link3 />
      <Link4 />
      <Link5 />
      <Link6 />
      <Link7 />
      <Link8 />
    </div>
  );
}

function Icon47() {
  return (
    <div className="absolute left-[74.06px] size-[16px] top-[8px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M10 12L6 8L10 4" id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function N1() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[96.06px] top-[6px] w-[52.859px]" data-name="n5">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[#0a0a0a] text-[14px] text-center whitespace-nowrap">Thu gọn</p>
    </div>
  );
}

function Button14() {
  return (
    <div className="absolute h-[32px] left-[16px] rounded-[8px] top-[822px] w-[223px]" data-name="Button">
      <Icon47 />
      <N1 />
    </div>
  );
}

function N() {
  return (
    <div className="absolute bg-white border-[rgba(0,0,0,0.1)] border-r border-solid h-[870px] left-0 top-0 w-[256px]" data-name="n5">
      <Container143 />
      <Navigation />
      <Button14 />
    </div>
  );
}

export default function WebBasedInvoiceManagementSystem() {
  return (
    <div className="bg-white relative size-full" data-name="Web-based Invoice Management System">
      <Body />
      <UF />
      <N />
    </div>
  );
}