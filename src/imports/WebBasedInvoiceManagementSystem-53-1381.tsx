import svgPaths from "./svg-2u8rpft3lj";

function ArrowLeft() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="ArrowLeft">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="ArrowLeft">
          <path d={svgPaths.p203476e0} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M12.6667 8H3.33333" id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Link() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[40px]" data-name="Link">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <ArrowLeft />
      </div>
    </div>
  );
}

function H() {
  return (
    <div className="content-stretch flex h-[32px] items-start relative shrink-0 w-full" data-name="h1">
      <p className="font-['Inter:Bold',sans-serif] font-bold leading-[32px] not-italic relative shrink-0 text-[#101828] text-[24px] whitespace-nowrap">Trình chỉnh sửa mẫu hóa đơn</p>
    </div>
  );
}

function P() {
  return (
    <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="p">
      <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[20px] min-h-px min-w-px not-italic relative text-[#6a7282] text-[14px]">Chế độ trực quan</p>
    </div>
  );
}

function Container2() {
  return (
    <div className="flex-[1_0_0] h-[52px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <H />
        <P />
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="h-[52px] relative shrink-0 w-[383.984px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-center relative size-full">
        <Link />
        <Container2 />
      </div>
    </div>
  );
}

function Eye() {
  return (
    <div className="absolute left-[11px] size-[16px] top-[8px]" data-name="Eye">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Eye">
          <path d={svgPaths.pad05c0} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p28db2b80} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="bg-white flex-[1_0_0] h-[32px] min-h-px min-w-px relative rounded-[8px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Eye />
        <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[74px] not-italic text-[#0a0a0a] text-[14px] text-center top-[5px] whitespace-nowrap">Xem trước</p>
      </div>
    </div>
  );
}

function FileDown() {
  return (
    <div className="absolute left-[11px] size-[16px] top-[8px]" data-name="FileDown">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="FileDown">
          <path d={svgPaths.p19416e00} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3e059a80} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 12V8" id="Vector_3" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M6 10L8 12L10 10" id="Vector_4" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-white h-[32px] relative rounded-[8px] shrink-0 w-[110.313px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <FileDown />
        <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[70px] not-italic text-[#0a0a0a] text-[14px] text-center top-[5px] whitespace-nowrap">Xuất PDF</p>
      </div>
    </div>
  );
}

function Save() {
  return (
    <div className="absolute left-[10px] size-[16px] top-[8px]" data-name="Save">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Save">
          <path d={svgPaths.p3c401780} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p56b0600} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p17caa400} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button2() {
  return (
    <div className="bg-[#1e88e5] h-[32px] relative rounded-[8px] shrink-0 w-[73.75px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Save />
        <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[52px] not-italic text-[14px] text-center text-white top-[5px] whitespace-nowrap">Lưu</p>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="h-[32px] relative shrink-0 w-[318.547px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Button />
        <Button1 />
        <Button2 />
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="bg-white h-[85px] relative shrink-0 w-[1260px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0.1)] border-b border-solid inset-0 pointer-events-none shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between pb-px px-[24px] relative size-full">
        <Container1 />
        <Container3 />
      </div>
    </div>
  );
}

function Label() {
  return (
    <div className="content-stretch flex h-[14px] items-center relative shrink-0 w-full" data-name="Label">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[14px] not-italic relative shrink-0 text-[#0a0a0a] text-[14px] whitespace-nowrap">Tên mẫu in</p>
    </div>
  );
}

function Input() {
  return (
    <div className="bg-[#f3f3f5] h-[40px] relative rounded-[8px] shrink-0 w-full" data-name="Input">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center px-[12px] py-[4px] relative size-full">
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#717182] text-[14px] whitespace-nowrap">Mẫu hóa đơn mới</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Container7() {
  return (
    <div className="flex-[1_0_0] h-[62px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-start relative size-full">
        <Label />
        <Input />
      </div>
    </div>
  );
}

function Label1() {
  return (
    <div className="content-stretch flex h-[14px] items-center relative shrink-0 w-full" data-name="Label">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[14px] not-italic relative shrink-0 text-[#0a0a0a] text-[14px] whitespace-nowrap">Chế độ xem</p>
    </div>
  );
}

function Layout() {
  return (
    <div className="absolute left-[10px] size-[16px] top-[10px]" data-name="Layout">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Layout">
          <path d={svgPaths.p19d57600} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M2 6H14" id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M6 14V6" id="Vector_3" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button3() {
  return (
    <div className="bg-white flex-[1_0_0] h-[36px] min-h-px min-w-px relative rounded-[8px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Layout />
        <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[53.5px] not-italic text-[#0a0a0a] text-[14px] text-center top-[7px] whitespace-nowrap">Visual</p>
      </div>
    </div>
  );
}

function Code() {
  return (
    <div className="absolute left-[10px] size-[16px] top-[10px]" data-name="Code2">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Code2">
          <path d={svgPaths.p107b6100} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p27a85e80} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p2fc3a80} id="Vector_3" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button4() {
  return (
    <div className="flex-[1_0_0] h-[36px] min-h-px min-w-px relative rounded-[8px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Code />
        <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[53px] not-italic text-[#0a0a0a] text-[14px] text-center top-[7px] whitespace-nowrap">HTML</p>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="bg-[#f9fafb] h-[42px] relative rounded-[10px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[3px] py-px relative size-full">
          <Button3 />
          <Button4 />
        </div>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="h-[64px] relative shrink-0 w-[169.625px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-start relative size-full">
        <Label1 />
        <Container9 />
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex gap-[16px] h-[64px] items-end relative shrink-0 w-full" data-name="Container">
      <Container7 />
      <Container8 />
    </div>
  );
}

function Settings() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Settings">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Settings">
          <path d={svgPaths.p2338cf00} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p28db2b80} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Span() {
  return (
    <div className="flex-[1_0_0] h-[20px] min-h-px min-w-px relative" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[#0a0a0a] text-[14px] text-center whitespace-nowrap">Cài đặt khổ giấy</p>
      </div>
    </div>
  );
}

function Div2() {
  return (
    <div className="h-[20px] relative shrink-0 w-[126.469px]" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Settings />
        <Span />
      </div>
    </div>
  );
}

function ChevronDown() {
  return (
    <div className="relative size-[16px]" data-name="ChevronDown">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="ChevronDown">
          <path d="M4 6L8 10L12 6" id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button5() {
  return (
    <div className="bg-white h-[32px] relative rounded-[8px] shrink-0 w-full" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[11px] py-px relative size-full">
          <Div2 />
          <div className="flex items-center justify-center relative shrink-0">
            <div className="flex-none rotate-180">
              <ChevronDown />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Label2() {
  return (
    <div className="content-stretch flex h-[16px] items-center relative shrink-0 w-full" data-name="Label">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#0a0a0a] text-[12px] whitespace-nowrap">Khổ giấy</p>
    </div>
  );
}

function SelectValue() {
  return (
    <div className="h-[20px] relative shrink-0 w-[17.469px]" data-name="SelectValue">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center overflow-clip relative rounded-[inherit] size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[#0a0a0a] text-[14px] text-center whitespace-nowrap">A4</p>
      </div>
    </div>
  );
}

function ChevronDownIcon() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="ChevronDownIcon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="ChevronDownIcon" opacity="0.5">
          <path d="M4 6L8 10L12 6" id="Vector" stroke="var(--stroke-0, #717182)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function SelectTrigger() {
  return (
    <div className="bg-[#f3f3f5] h-[36px] relative rounded-[8px] shrink-0 w-full" data-name="SelectTrigger">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[13px] py-px relative size-full">
          <SelectValue />
          <ChevronDownIcon />
        </div>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[60px] items-start left-0 top-0 w-[136px]" data-name="Container">
      <Label2 />
      <SelectTrigger />
    </div>
  );
}

function Label3() {
  return (
    <div className="content-stretch flex h-[16px] items-center relative shrink-0 w-full" data-name="Label">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#0a0a0a] text-[12px] whitespace-nowrap">Hướng giấy</p>
    </div>
  );
}

function SelectValue1() {
  return (
    <div className="h-[20px] relative shrink-0 w-[25px]" data-name="SelectValue">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center overflow-clip relative rounded-[inherit] size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[#0a0a0a] text-[14px] text-center whitespace-nowrap">Dọc</p>
      </div>
    </div>
  );
}

function ChevronDownIcon1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="ChevronDownIcon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="ChevronDownIcon" opacity="0.5">
          <path d="M4 6L8 10L12 6" id="Vector" stroke="var(--stroke-0, #717182)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function SelectTrigger1() {
  return (
    <div className="bg-[#f3f3f5] h-[36px] relative rounded-[8px] shrink-0 w-full" data-name="SelectTrigger">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[13px] py-px relative size-full">
          <SelectValue1 />
          <ChevronDownIcon1 />
        </div>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[60px] items-start left-[148px] top-0 w-[136px]" data-name="Container">
      <Label3 />
      <SelectTrigger1 />
    </div>
  );
}

function Label4() {
  return (
    <div className="content-stretch flex h-[16px] items-center relative shrink-0 w-full" data-name="Label">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#0a0a0a] text-[12px] whitespace-nowrap">Lề trang (mm)</p>
    </div>
  );
}

function Input1() {
  return (
    <div className="bg-[#f3f3f5] col-1 justify-self-stretch relative rounded-[8px] row-1 self-stretch shrink-0" data-name="Input">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center px-[12px] py-[4px] relative size-full">
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#717182] text-[14px] whitespace-nowrap">20</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Input2() {
  return (
    <div className="bg-[#f3f3f5] col-2 justify-self-stretch relative rounded-[8px] row-1 self-stretch shrink-0" data-name="Input">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center px-[12px] py-[4px] relative size-full">
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#717182] text-[14px] whitespace-nowrap">20</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Input3() {
  return (
    <div className="bg-[#f3f3f5] col-3 justify-self-stretch relative rounded-[8px] row-1 self-stretch shrink-0" data-name="Input">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center px-[12px] py-[4px] relative size-full">
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#717182] text-[14px] whitespace-nowrap">20</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Input4() {
  return (
    <div className="bg-[#f3f3f5] col-4 justify-self-stretch relative rounded-[8px] row-1 self-stretch shrink-0" data-name="Input">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center px-[12px] py-[4px] relative size-full">
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#717182] text-[14px] whitespace-nowrap">20</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Container13() {
  return (
    <div className="gap-x-[8px] gap-y-[8px] grid grid-cols-[repeat(4,minmax(0,1fr))] grid-rows-[repeat(1,minmax(0,1fr))] h-[36px] relative shrink-0 w-full" data-name="Container">
      <Input1 />
      <Input2 />
      <Input3 />
      <Input4 />
    </div>
  );
}

function Container12() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[60px] items-start left-[296px] top-0 w-[284px]" data-name="Container">
      <Label4 />
      <Container13 />
    </div>
  );
}

function Div3() {
  return (
    <div className="h-[60px] relative shrink-0 w-full" data-name="div">
      <Container10 />
      <Container11 />
      <Container12 />
    </div>
  );
}

function Collapsible() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] h-[104px] items-start relative shrink-0 w-full" data-name="Collapsible">
      <Button5 />
      <Div3 />
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] h-[184px] items-start relative shrink-0 w-full" data-name="Container">
      <Container6 />
      <Collapsible />
    </div>
  );
}

function Container4() {
  return (
    <div className="h-[233px] relative shrink-0 w-[628px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0.1)] border-b border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-px pt-[24px] px-[24px] relative size-full">
        <Container5 />
      </div>
    </div>
  );
}

function H2() {
  return (
    <div className="h-[27px] relative shrink-0 w-full" data-name="h3">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[27px] left-0 not-italic text-[#101828] text-[18px] top-[-1px] whitespace-nowrap">Thư viện khối</p>
    </div>
  );
}

function P1() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="p">
      <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[16px] min-h-px min-w-px not-italic relative text-[#6a7282] text-[12px]">Kéo thả hoặc nhấp để thêm</p>
    </div>
  );
}

function Container16() {
  return (
    <div className="bg-white h-[80px] relative shrink-0 w-[287px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0.1)] border-b border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start pb-px pt-[16px] px-[16px] relative size-full">
        <H2 />
        <P1 />
      </div>
    </div>
  );
}

function Div4() {
  return (
    <div className="bg-[#eff6ff] relative rounded-[10px] shrink-0 size-[40px]" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[28px] not-italic relative shrink-0 text-[#0a0a0a] text-[20px] whitespace-nowrap">📄</p>
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[20px] min-h-px min-w-px not-italic relative text-[#101828] text-[14px]">Đầu trang</p>
    </div>
  );
}

function Container20() {
  return (
    <div className="content-stretch flex h-[16px] items-start overflow-clip relative shrink-0 w-full" data-name="Container">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#6a7282] text-[12px] whitespace-nowrap">Logo và thông tin công ty</p>
    </div>
  );
}

function Div5() {
  return (
    <div className="flex-[1_0_0] h-[36px] min-h-px min-w-px relative" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container19 />
        <Container20 />
      </div>
    </div>
  );
}

function Plus() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Plus">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Plus">
          <path d="M3.33333 8H12.6667" id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 3.33333V12.6667" id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button6() {
  return (
    <div className="bg-white h-[66px] relative rounded-[10px] shrink-0 w-full" data-name="button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[13px] py-px relative size-full">
          <Div4 />
          <Div5 />
          <Plus />
        </div>
      </div>
    </div>
  );
}

function Div6() {
  return (
    <div className="bg-[#eff6ff] relative rounded-[10px] shrink-0 size-[40px]" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[28px] not-italic relative shrink-0 text-[#0a0a0a] text-[20px] whitespace-nowrap">📋</p>
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[20px] min-h-px min-w-px not-italic relative text-[#101828] text-[14px]">Tiêu đề hóa đơn</p>
    </div>
  );
}

function Container22() {
  return (
    <div className="content-stretch flex h-[16px] items-start overflow-clip relative shrink-0 w-full" data-name="Container">
      <p className="flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[16px] min-h-px min-w-px not-italic relative text-[#6a7282] text-[12px]">HÓA ĐƠN / BÁO GIÁ</p>
    </div>
  );
}

function Div7() {
  return (
    <div className="flex-[1_0_0] h-[36px] min-h-px min-w-px relative" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container21 />
        <Container22 />
      </div>
    </div>
  );
}

function Plus1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Plus">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Plus">
          <path d="M3.33333 8H12.6667" id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 3.33333V12.6667" id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button7() {
  return (
    <div className="bg-white h-[66px] relative rounded-[10px] shrink-0 w-full" data-name="button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[13px] py-px relative size-full">
          <Div6 />
          <Div7 />
          <Plus1 />
        </div>
      </div>
    </div>
  );
}

function Div8() {
  return (
    <div className="bg-[#eff6ff] relative rounded-[10px] shrink-0 size-[40px]" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[28px] not-italic relative shrink-0 text-[#0a0a0a] text-[20px] whitespace-nowrap">👤</p>
      </div>
    </div>
  );
}

function Container23() {
  return (
    <div className="h-[40px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#101828] text-[14px] top-[-1px] w-[103px]">Thông tin khách hàng</p>
    </div>
  );
}

function Container24() {
  return (
    <div className="content-stretch flex h-[16px] items-start overflow-clip relative shrink-0 w-full" data-name="Container">
      <p className="flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[16px] min-h-px min-w-px not-italic relative text-[#6a7282] text-[12px]">Tên, địa chỉ, SĐT</p>
    </div>
  );
}

function Div9() {
  return (
    <div className="flex-[1_0_0] h-[56px] min-h-px min-w-px relative" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container23 />
        <Container24 />
      </div>
    </div>
  );
}

function Plus2() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Plus">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Plus">
          <path d="M3.33333 8H12.6667" id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 3.33333V12.6667" id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button8() {
  return (
    <div className="bg-white h-[82px] relative rounded-[10px] shrink-0 w-full" data-name="button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[13px] py-px relative size-full">
          <Div8 />
          <Div9 />
          <Plus2 />
        </div>
      </div>
    </div>
  );
}

function Div10() {
  return (
    <div className="bg-[#eff6ff] relative rounded-[10px] shrink-0 size-[40px]" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[28px] not-italic relative shrink-0 text-[#0a0a0a] text-[20px] whitespace-nowrap">📅</p>
      </div>
    </div>
  );
}

function Container25() {
  return (
    <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[20px] min-h-px min-w-px not-italic relative text-[#101828] text-[14px]">Thông tin hóa đơn</p>
    </div>
  );
}

function Container26() {
  return (
    <div className="content-stretch flex h-[16px] items-start overflow-clip relative shrink-0 w-full" data-name="Container">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#6a7282] text-[12px] whitespace-nowrap">Mã, ngày tạo, hạn thanh toán</p>
    </div>
  );
}

function Div11() {
  return (
    <div className="flex-[1_0_0] h-[36px] min-h-px min-w-px relative" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container25 />
        <Container26 />
      </div>
    </div>
  );
}

function Plus3() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Plus">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Plus">
          <path d="M3.33333 8H12.6667" id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 3.33333V12.6667" id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button9() {
  return (
    <div className="bg-white h-[66px] relative rounded-[10px] shrink-0 w-full" data-name="button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[13px] py-px relative size-full">
          <Div10 />
          <Div11 />
          <Plus3 />
        </div>
      </div>
    </div>
  );
}

function Div12() {
  return (
    <div className="bg-[#eff6ff] relative rounded-[10px] shrink-0 size-[40px]" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[28px] not-italic relative shrink-0 text-[#0a0a0a] text-[20px] whitespace-nowrap">📊</p>
      </div>
    </div>
  );
}

function Container27() {
  return (
    <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[20px] min-h-px min-w-px not-italic relative text-[#101828] text-[14px]">Bảng mặt hàng</p>
    </div>
  );
}

function Container28() {
  return (
    <div className="content-stretch flex h-[16px] items-start overflow-clip relative shrink-0 w-full" data-name="Container">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#6a7282] text-[12px] whitespace-nowrap">Danh sách sản phẩm/dịch vụ</p>
    </div>
  );
}

function Div13() {
  return (
    <div className="flex-[1_0_0] h-[36px] min-h-px min-w-px relative" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container27 />
        <Container28 />
      </div>
    </div>
  );
}

function Plus4() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Plus">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Plus">
          <path d="M3.33333 8H12.6667" id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 3.33333V12.6667" id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button10() {
  return (
    <div className="bg-white h-[66px] relative rounded-[10px] shrink-0 w-full" data-name="button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[13px] py-px relative size-full">
          <Div12 />
          <Div13 />
          <Plus4 />
        </div>
      </div>
    </div>
  );
}

function Div14() {
  return (
    <div className="bg-[#eff6ff] relative rounded-[10px] shrink-0 size-[40px]" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[28px] not-italic relative shrink-0 text-[#0a0a0a] text-[20px] whitespace-nowrap">💰</p>
      </div>
    </div>
  );
}

function Container29() {
  return (
    <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[20px] min-h-px min-w-px not-italic relative text-[#101828] text-[14px]">Tổng tiền</p>
    </div>
  );
}

function Container30() {
  return (
    <div className="content-stretch flex h-[16px] items-start overflow-clip relative shrink-0 w-full" data-name="Container">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#6a7282] text-[12px] whitespace-nowrap">Tổng cộng, đã thanh toán, còn lại</p>
    </div>
  );
}

function Div15() {
  return (
    <div className="flex-[1_0_0] h-[36px] min-h-px min-w-px relative" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container29 />
        <Container30 />
      </div>
    </div>
  );
}

function Plus5() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Plus">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Plus">
          <path d="M3.33333 8H12.6667" id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 3.33333V12.6667" id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button11() {
  return (
    <div className="bg-white h-[66px] relative rounded-[10px] shrink-0 w-full" data-name="button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[13px] py-px relative size-full">
          <Div14 />
          <Div15 />
          <Plus5 />
        </div>
      </div>
    </div>
  );
}

function Div16() {
  return (
    <div className="bg-[#eff6ff] relative rounded-[10px] shrink-0 size-[40px]" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[28px] not-italic relative shrink-0 text-[#0a0a0a] text-[20px] whitespace-nowrap">💳</p>
      </div>
    </div>
  );
}

function Container31() {
  return (
    <div className="h-[40px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#101828] text-[14px] top-[-1px] w-[103px]">Thông tin thanh toán</p>
    </div>
  );
}

function Container32() {
  return (
    <div className="content-stretch flex h-[16px] items-start overflow-clip relative shrink-0 w-full" data-name="Container">
      <p className="flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[16px] min-h-px min-w-px not-italic relative text-[#6a7282] text-[12px]">Ngân hàng, QR code</p>
    </div>
  );
}

function Div17() {
  return (
    <div className="flex-[1_0_0] h-[56px] min-h-px min-w-px relative" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container31 />
        <Container32 />
      </div>
    </div>
  );
}

function Plus6() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Plus">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Plus">
          <path d="M3.33333 8H12.6667" id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 3.33333V12.6667" id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button12() {
  return (
    <div className="bg-white h-[82px] relative rounded-[10px] shrink-0 w-full" data-name="button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[13px] py-px relative size-full">
          <Div16 />
          <Div17 />
          <Plus6 />
        </div>
      </div>
    </div>
  );
}

function Div18() {
  return (
    <div className="bg-[#eff6ff] relative rounded-[10px] shrink-0 size-[40px]" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[28px] not-italic relative shrink-0 text-[#0a0a0a] text-[20px] whitespace-nowrap">✍️</p>
      </div>
    </div>
  );
}

function Container33() {
  return (
    <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[20px] min-h-px min-w-px not-italic relative text-[#101828] text-[14px]">Chữ ký</p>
    </div>
  );
}

function Container34() {
  return (
    <div className="content-stretch flex h-[16px] items-start overflow-clip relative shrink-0 w-full" data-name="Container">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#6a7282] text-[12px] whitespace-nowrap">{`Người bán & khách hàng`}</p>
    </div>
  );
}

function Div19() {
  return (
    <div className="flex-[1_0_0] h-[36px] min-h-px min-w-px relative" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container33 />
        <Container34 />
      </div>
    </div>
  );
}

function Plus7() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Plus">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Plus">
          <path d="M3.33333 8H12.6667" id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 3.33333V12.6667" id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button13() {
  return (
    <div className="bg-white h-[66px] relative rounded-[10px] shrink-0 w-full" data-name="button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[13px] py-px relative size-full">
          <Div18 />
          <Div19 />
          <Plus7 />
        </div>
      </div>
    </div>
  );
}

function Div20() {
  return (
    <div className="bg-[#eff6ff] relative rounded-[10px] shrink-0 size-[40px]" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[28px] not-italic relative shrink-0 text-[#0a0a0a] text-[20px] whitespace-nowrap">📝</p>
      </div>
    </div>
  );
}

function Container35() {
  return (
    <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[20px] min-h-px min-w-px not-italic relative text-[#101828] text-[14px]">Chân trang</p>
    </div>
  );
}

function Container36() {
  return (
    <div className="content-stretch flex h-[16px] items-start overflow-clip relative shrink-0 w-full" data-name="Container">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#6a7282] text-[12px] whitespace-nowrap">Lời cảm ơn, điều khoản</p>
    </div>
  );
}

function Div21() {
  return (
    <div className="flex-[1_0_0] h-[36px] min-h-px min-w-px relative" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container35 />
        <Container36 />
      </div>
    </div>
  );
}

function Plus8() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Plus">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Plus">
          <path d="M3.33333 8H12.6667" id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 3.33333V12.6667" id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button14() {
  return (
    <div className="bg-white h-[66px] relative rounded-[10px] shrink-0 w-full" data-name="button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[13px] py-px relative size-full">
          <Div20 />
          <Div21 />
          <Plus8 />
        </div>
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[690px] items-start relative shrink-0 w-full" data-name="Container">
      <Button6 />
      <Button7 />
      <Button8 />
      <Button9 />
      <Button10 />
      <Button11 />
      <Button12 />
      <Button13 />
      <Button14 />
    </div>
  );
}

function Container17() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[287px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip pl-[16px] pr-[31px] pt-[-234px] relative rounded-[inherit] size-full">
        <Container18 />
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="bg-[#f9fafb] h-[552px] relative shrink-0 w-[288px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0.1)] border-r border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pr-px relative size-full">
        <Container16 />
        <Container17 />
      </div>
    </div>
  );
}

function Container42() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="flex-[1_0_0] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] min-h-px min-w-px not-italic relative text-[#6a7282] text-[12px] tracking-[0.3px] uppercase">Đầu trang</p>
    </div>
  );
}

function Container44() {
  return (
    <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="flex-[1_0_0] font-['Inter:Bold',sans-serif] font-bold leading-[20px] min-h-px min-w-px not-italic relative text-[#1e88e5] text-[14px] text-center">CỬA HÀNG VLXD XƯƠNG LUÂN</p>
    </div>
  );
}

function Container45() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[16px] min-h-px min-w-px not-italic relative text-[#4a5565] text-[12px] text-center">123 Đường Võ Văn Tần, Quận 3, TP.HCM</p>
    </div>
  );
}

function Container46() {
  return (
    <div className="h-[32px] relative shrink-0 w-full" data-name="Container">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-[120.64px] not-italic text-[#4a5565] text-[12px] text-center top-0 w-[141px]">ĐT: 028 1234 5678 • Email: info@vlxdxuonglan.vn</p>
    </div>
  );
}

function Container43() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] h-[76px] items-start relative shrink-0 w-full" data-name="Container">
      <Container44 />
      <Container45 />
      <Container46 />
    </div>
  );
}

function Container41() {
  return (
    <div className="h-[148px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col gap-[8px] items-start pt-[32px] px-[16px] relative size-full">
        <Container42 />
        <Container43 />
      </div>
    </div>
  );
}

function Container40() {
  return (
    <div className="bg-white h-[152px] relative rounded-[10px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-2 border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="content-stretch flex flex-col items-start p-[2px] relative size-full">
        <Container41 />
      </div>
    </div>
  );
}

function Container49() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="flex-[1_0_0] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] min-h-px min-w-px not-italic relative text-[#6a7282] text-[12px] tracking-[0.3px] uppercase">Tiêu đề hóa đơn</p>
    </div>
  );
}

function Container51() {
  return (
    <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="flex-[1_0_0] font-['Inter:Bold',sans-serif] font-bold leading-[20px] min-h-px min-w-px not-italic relative text-[#0a0a0a] text-[14px] text-center">HÓA ĐƠN BÁN HÀNG</p>
    </div>
  );
}

function Container52() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="flex-[1_0_0] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] min-h-px min-w-px not-italic relative text-[#1e88e5] text-[12px] text-center">HD-001</p>
    </div>
  );
}

function Container50() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] h-[40px] items-start relative shrink-0 w-full" data-name="Container">
      <Container51 />
      <Container52 />
    </div>
  );
}

function Container48() {
  return (
    <div className="h-[112px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col gap-[8px] items-start pt-[32px] px-[16px] relative size-full">
        <Container49 />
        <Container50 />
      </div>
    </div>
  );
}

function Container47() {
  return (
    <div className="bg-white h-[116px] relative rounded-[10px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-2 border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="content-stretch flex flex-col items-start p-[2px] relative size-full">
        <Container48 />
      </div>
    </div>
  );
}

function Container55() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="flex-[1_0_0] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] min-h-px min-w-px not-italic relative text-[#6a7282] text-[12px] tracking-[0.3px] uppercase">Thông tin hóa đơn</p>
    </div>
  );
}

function Container57() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="flex-[1_0_0] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[0] min-h-px min-w-px not-italic relative text-[#0a0a0a] text-[0px] text-[12px]">
        <span className="leading-[16px]">Ngày tạo:</span>
        <span className="font-['Inter:Regular',sans-serif] font-normal leading-[16px]">{` 24/02/2026`}</span>
      </p>
    </div>
  );
}

function Container58() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="flex-[1_0_0] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[0] min-h-px min-w-px not-italic relative text-[#0a0a0a] text-[0px] text-[12px]">
        <span className="leading-[16px]">Ngày đến hạn:</span>
        <span className="font-['Inter:Regular',sans-serif] font-normal leading-[16px]">{` 26/03/2026`}</span>
      </p>
    </div>
  );
}

function Container56() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] h-[36px] items-start relative shrink-0 w-full" data-name="Container">
      <Container57 />
      <Container58 />
    </div>
  );
}

function Container54() {
  return (
    <div className="h-[108px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col gap-[8px] items-start pt-[32px] px-[16px] relative size-full">
        <Container55 />
        <Container56 />
      </div>
    </div>
  );
}

function Container53() {
  return (
    <div className="bg-white h-[112px] relative rounded-[10px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-2 border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="content-stretch flex flex-col items-start p-[2px] relative size-full">
        <Container54 />
      </div>
    </div>
  );
}

function Container61() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="flex-[1_0_0] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] min-h-px min-w-px not-italic relative text-[#6a7282] text-[12px] tracking-[0.3px] uppercase">Thông tin khách hàng</p>
    </div>
  );
}

function Container63() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="flex-[1_0_0] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[0] min-h-px min-w-px not-italic relative text-[#0a0a0a] text-[0px] text-[12px]">
        <span className="leading-[16px]">Khách hàng:</span>
        <span className="font-['Inter:Regular',sans-serif] font-normal leading-[16px]">{` Anh Hòa Q.1`}</span>
      </p>
    </div>
  );
}

function Container64() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[0] not-italic relative shrink-0 text-[#0a0a0a] text-[0px] text-[12px] whitespace-nowrap">
        <span className="leading-[16px]">Địa chỉ:</span>
        <span className="font-['Inter:Regular',sans-serif] font-normal leading-[16px]">{` 456 Đường Lê Lợi, Quận 1, TP.HCM`}</span>
      </p>
    </div>
  );
}

function Container65() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="flex-[1_0_0] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[0] min-h-px min-w-px not-italic relative text-[#0a0a0a] text-[0px] text-[12px]">
        <span className="leading-[16px]">ĐT:</span>
        <span className="font-['Inter:Regular',sans-serif] font-normal leading-[16px]">{` 0901 234 567`}</span>
      </p>
    </div>
  );
}

function Container62() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] h-[56px] items-start relative shrink-0 w-full" data-name="Container">
      <Container63 />
      <Container64 />
      <Container65 />
    </div>
  );
}

function Container60() {
  return (
    <div className="h-[128px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col gap-[8px] items-start pt-[32px] px-[16px] relative size-full">
        <Container61 />
        <Container62 />
      </div>
    </div>
  );
}

function Container59() {
  return (
    <div className="bg-white h-[132px] relative rounded-[10px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-2 border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="content-stretch flex flex-col items-start p-[2px] relative size-full">
        <Container60 />
      </div>
    </div>
  );
}

function Container68() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="flex-[1_0_0] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] min-h-px min-w-px not-italic relative text-[#6a7282] text-[12px] tracking-[0.3px] uppercase">Bảng mặt hàng</p>
    </div>
  );
}

function Th() {
  return (
    <div className="absolute h-[40px] left-0 top-0 w-[29.031px]" data-name="th">
      <p className="-translate-x-1/2 absolute font-['Inter:Bold',sans-serif] font-bold leading-[16px] left-[15px] not-italic text-[12px] text-center text-white top-[12px] whitespace-nowrap">STT</p>
    </div>
  );
}

function Th1() {
  return (
    <div className="absolute h-[40px] left-[29.03px] top-0 w-[41.969px]" data-name="th">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[16px] left-[4px] not-italic text-[12px] text-white top-[4px] w-[29px]">Tên hàng</p>
    </div>
  );
}

function Th2() {
  return (
    <div className="absolute h-[40px] left-[71px] top-0 w-[32.125px]" data-name="th">
      <p className="-translate-x-1/2 absolute font-['Inter:Bold',sans-serif] font-bold leading-[16px] left-[16px] not-italic text-[12px] text-center text-white top-[12px] whitespace-nowrap">ĐVT</p>
    </div>
  );
}

function Th3() {
  return (
    <div className="absolute h-[40px] left-[103.13px] top-0 w-[27.406px]" data-name="th">
      <p className="-translate-x-1/2 absolute font-['Inter:Bold',sans-serif] font-bold leading-[16px] left-[13.77px] not-italic text-[12px] text-center text-white top-[12px] whitespace-nowrap">SL</p>
    </div>
  );
}

function Th4() {
  return (
    <div className="absolute h-[40px] left-[130.53px] top-0 w-[56.484px]" data-name="th">
      <p className="-translate-x-full absolute font-['Inter:Bold',sans-serif] font-bold leading-[16px] left-[53.2px] not-italic text-[12px] text-right text-white top-[12px] whitespace-nowrap">Đơn giá</p>
    </div>
  );
}

function Th5() {
  return (
    <div className="absolute h-[40px] left-[187.02px] top-0 w-[72.672px]" data-name="th">
      <p className="-translate-x-full absolute font-['Inter:Bold',sans-serif] font-bold leading-[16px] left-[69.33px] not-italic text-[12px] text-right text-white top-[12px] whitespace-nowrap">Thành tiền</p>
    </div>
  );
}

function Tr() {
  return (
    <div className="absolute bg-[#1e88e5] h-[40px] left-0 top-0 w-[259.688px]" data-name="tr">
      <Th />
      <Th1 />
      <Th2 />
      <Th3 />
      <Th4 />
      <Th5 />
    </div>
  );
}

function Thead() {
  return (
    <div className="absolute h-[40px] left-0 top-0 w-[259.688px]" data-name="thead">
      <Tr />
    </div>
  );
}

function Td() {
  return (
    <div className="absolute h-[72.5px] left-0 top-0 w-[29.031px]" data-name="td">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-[4px] not-italic text-[#0a0a0a] text-[12px] top-[28px] whitespace-nowrap">1</p>
    </div>
  );
}

function Td1() {
  return (
    <div className="absolute h-[72.5px] left-[29.03px] top-0 w-[41.969px]" data-name="td">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-[4px] not-italic text-[#0a0a0a] text-[12px] top-[4px] w-[32px]">Gạch Đồng Tâm 60x60</p>
    </div>
  );
}

function Td2() {
  return (
    <div className="absolute h-[72.5px] left-[71px] top-0 w-[32.125px]" data-name="td">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-[16.84px] not-italic text-[#0a0a0a] text-[12px] text-center top-[28px] whitespace-nowrap">Viên</p>
    </div>
  );
}

function Td3() {
  return (
    <div className="absolute h-[72.5px] left-[103.13px] top-0 w-[27.406px]" data-name="td">
      <p className="-translate-x-full absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-[24px] not-italic text-[#0a0a0a] text-[12px] text-right top-[28px] whitespace-nowrap">200</p>
    </div>
  );
}

function Td4() {
  return (
    <div className="absolute h-[72.5px] left-[130.53px] top-0 w-[56.484px]" data-name="td">
      <p className="-translate-x-full absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-[53.47px] not-italic text-[#0a0a0a] text-[12px] text-right top-[28px] whitespace-nowrap">80.000₫</p>
    </div>
  );
}

function Td5() {
  return (
    <div className="absolute h-[72.5px] left-[187.02px] top-0 w-[72.672px]" data-name="td">
      <p className="-translate-x-full absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] left-[69px] not-italic text-[#0a0a0a] text-[12px] text-right top-[28px] whitespace-nowrap">16.000.000₫</p>
    </div>
  );
}

function Tr1() {
  return (
    <div className="absolute border-[#e5e7eb] border-b border-solid h-[72.5px] left-0 top-0 w-[259.688px]" data-name="tr">
      <Td />
      <Td1 />
      <Td2 />
      <Td3 />
      <Td4 />
      <Td5 />
    </div>
  );
}

function Td6() {
  return (
    <div className="absolute h-[89px] left-0 top-0 w-[29.031px]" data-name="td">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-[4px] not-italic text-[#0a0a0a] text-[12px] top-[36.5px] whitespace-nowrap">2</p>
    </div>
  );
}

function Td7() {
  return (
    <div className="absolute h-[89px] left-[29.03px] top-0 w-[41.969px]" data-name="td">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-[4px] not-italic text-[#0a0a0a] text-[12px] top-[4.5px] w-[34px]">Xi măng Hà Tiên PCB40</p>
    </div>
  );
}

function Td8() {
  return (
    <div className="absolute h-[89px] left-[71px] top-0 w-[32.125px]" data-name="td">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-[16.05px] not-italic text-[#0a0a0a] text-[12px] text-center top-[36.5px] whitespace-nowrap">Bao</p>
    </div>
  );
}

function Td9() {
  return (
    <div className="absolute h-[89px] left-[103.13px] top-0 w-[27.406px]" data-name="td">
      <p className="-translate-x-full absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-[24px] not-italic text-[#0a0a0a] text-[12px] text-right top-[36.5px] whitespace-nowrap">100</p>
    </div>
  );
}

function Td10() {
  return (
    <div className="absolute h-[89px] left-[130.53px] top-0 w-[56.484px]" data-name="td">
      <p className="-translate-x-full absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-[53px] not-italic text-[#0a0a0a] text-[12px] text-right top-[36.5px] whitespace-nowrap">120.000₫</p>
    </div>
  );
}

function Td11() {
  return (
    <div className="absolute h-[89px] left-[187.02px] top-0 w-[72.672px]" data-name="td">
      <p className="-translate-x-full absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] left-[69.03px] not-italic text-[#0a0a0a] text-[12px] text-right top-[36.5px] whitespace-nowrap">12.000.000₫</p>
    </div>
  );
}

function Tr2() {
  return (
    <div className="absolute border-[#e5e7eb] border-b border-solid h-[89px] left-0 top-[72.5px] w-[259.688px]" data-name="tr">
      <Td6 />
      <Td7 />
      <Td8 />
      <Td9 />
      <Td10 />
      <Td11 />
    </div>
  );
}

function Tbody() {
  return (
    <div className="absolute h-[161.5px] left-0 top-[40px] w-[259.688px]" data-name="tbody">
      <Tr1 />
      <Tr2 />
    </div>
  );
}

function Table() {
  return (
    <div className="h-[202px] relative shrink-0 w-full" data-name="table">
      <Thead />
      <Tbody />
    </div>
  );
}

function Container69() {
  return (
    <div className="content-stretch flex flex-col h-[217px] items-start overflow-clip pr-[-18.688px] relative shrink-0 w-full" data-name="Container">
      <Table />
    </div>
  );
}

function Container67() {
  return (
    <div className="h-[289px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col gap-[8px] items-start pt-[32px] px-[16px] relative size-full">
        <Container68 />
        <Container69 />
      </div>
    </div>
  );
}

function Container66() {
  return (
    <div className="bg-white h-[293px] relative rounded-[10px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-2 border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="content-stretch flex flex-col items-start p-[2px] relative size-full">
        <Container67 />
      </div>
    </div>
  );
}

function Container72() {
  return (
    <div className="absolute content-stretch flex h-[16px] items-start left-[16px] top-[32px] w-[241px]" data-name="Container">
      <p className="flex-[1_0_0] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] min-h-px min-w-px not-italic relative text-[#6a7282] text-[12px] tracking-[0.3px] uppercase">Tổng tiền</p>
    </div>
  );
}

function Span1() {
  return (
    <div className="h-[16px] relative shrink-0 w-[49.172px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#0a0a0a] text-[12px] whitespace-nowrap">Tạm tính:</p>
      </div>
    </div>
  );
}

function Span2() {
  return (
    <div className="h-[16px] relative shrink-0 w-[64.031px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#0a0a0a] text-[12px] whitespace-nowrap">45.200.000₫</p>
      </div>
    </div>
  );
}

function Container74() {
  return (
    <div className="content-stretch flex h-[16px] items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Span1 />
      <Span2 />
    </div>
  );
}

function Span3() {
  return (
    <div className="h-[16px] relative shrink-0 w-[75.313px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Inter:Bold',sans-serif] font-bold leading-[16px] not-italic relative shrink-0 text-[#1e88e5] text-[12px] whitespace-nowrap">TỔNG CỘNG:</p>
      </div>
    </div>
  );
}

function Span4() {
  return (
    <div className="h-[16px] relative shrink-0 w-[69.5px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Inter:Bold',sans-serif] font-bold leading-[16px] not-italic relative shrink-0 text-[#1e88e5] text-[12px] whitespace-nowrap">45.200.000₫</p>
      </div>
    </div>
  );
}

function Container75() {
  return (
    <div className="content-stretch flex h-[16px] items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Span3 />
      <Span4 />
    </div>
  );
}

function Span5() {
  return (
    <div className="h-[16px] relative shrink-0 w-[78.234px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#00a63e] text-[12px] whitespace-nowrap">Đã thanh toán:</p>
      </div>
    </div>
  );
}

function Span6() {
  return (
    <div className="h-[16px] relative shrink-0 w-[64.031px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#00a63e] text-[12px] whitespace-nowrap">30.000.000₫</p>
      </div>
    </div>
  );
}

function Container76() {
  return (
    <div className="content-stretch flex h-[16px] items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Span5 />
      <Span6 />
    </div>
  );
}

function Span7() {
  return (
    <div className="h-[16px] relative shrink-0 w-[40.359px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] not-italic relative shrink-0 text-[#f54900] text-[12px] whitespace-nowrap">Còn lại:</p>
      </div>
    </div>
  );
}

function Span8() {
  return (
    <div className="h-[16px] relative shrink-0 w-[64.641px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] not-italic relative shrink-0 text-[#f54900] text-[12px] whitespace-nowrap">15.200.000₫</p>
      </div>
    </div>
  );
}

function Container77() {
  return (
    <div className="content-stretch flex h-[16px] items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Span7 />
      <Span8 />
    </div>
  );
}

function Container73() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] h-[76px] items-start left-[57px] top-[56px] w-[200px]" data-name="Container">
      <Container74 />
      <Container75 />
      <Container76 />
      <Container77 />
    </div>
  );
}

function Container71() {
  return (
    <div className="h-[148px] relative shrink-0 w-full" data-name="Container">
      <Container72 />
      <Container73 />
    </div>
  );
}

function Container70() {
  return (
    <div className="bg-white h-[152px] relative rounded-[10px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-2 border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="content-stretch flex flex-col items-start p-[2px] relative size-full">
        <Container71 />
      </div>
    </div>
  );
}

function Container80() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="flex-[1_0_0] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] min-h-px min-w-px not-italic relative text-[#6a7282] text-[12px] tracking-[0.3px] uppercase">Chữ ký</p>
    </div>
  );
}

function Container83() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="flex-[1_0_0] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] min-h-px min-w-px not-italic relative text-[#0a0a0a] text-[12px] text-center">Người bán hàng</p>
    </div>
  );
}

function Container84() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#99a1af] text-[12px] text-center whitespace-nowrap">(Ký và ghi rõ họ tên)</p>
    </div>
  );
}

function Container82() {
  return (
    <div className="col-1 content-stretch flex flex-col gap-[32px] items-start justify-self-stretch relative row-1 self-stretch shrink-0" data-name="Container">
      <Container83 />
      <Container84 />
    </div>
  );
}

function Container86() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="flex-[1_0_0] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] min-h-px min-w-px not-italic relative text-[#0a0a0a] text-[12px] text-center">Khách hàng</p>
    </div>
  );
}

function Container87() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#99a1af] text-[12px] text-center whitespace-nowrap">(Ký và ghi rõ họ tên)</p>
    </div>
  );
}

function Container85() {
  return (
    <div className="col-2 content-stretch flex flex-col gap-[32px] items-start justify-self-stretch relative row-1 self-stretch shrink-0" data-name="Container">
      <Container86 />
      <Container87 />
    </div>
  );
}

function Container81() {
  return (
    <div className="gap-x-[16px] gap-y-[16px] grid grid-cols-[repeat(2,minmax(0,1fr))] grid-rows-[repeat(1,minmax(0,1fr))] h-[64px] relative shrink-0 w-full" data-name="Container">
      <Container82 />
      <Container85 />
    </div>
  );
}

function Container79() {
  return (
    <div className="h-[136px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col gap-[8px] items-start pt-[32px] px-[16px] relative size-full">
        <Container80 />
        <Container81 />
      </div>
    </div>
  );
}

function Container78() {
  return (
    <div className="bg-white h-[140px] relative rounded-[10px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-2 border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="content-stretch flex flex-col items-start p-[2px] relative size-full">
        <Container79 />
      </div>
    </div>
  );
}

function Container90() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="flex-[1_0_0] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] min-h-px min-w-px not-italic relative text-[#6a7282] text-[12px] tracking-[0.3px] uppercase">Chân trang</p>
    </div>
  );
}

function Container91() {
  return (
    <div className="h-[32px] relative shrink-0 w-full" data-name="Container">
      <p className="-translate-x-1/2 absolute font-['Inter:Italic',sans-serif] font-normal italic leading-[16px] left-[120.88px] text-[#6a7282] text-[12px] text-center top-0 w-[232px]">Cảm ơn quý khách đã tin tưởng sử dụng sản phẩm của chúng tôi!</p>
    </div>
  );
}

function Container89() {
  return (
    <div className="h-[104px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col gap-[8px] items-start pt-[32px] px-[16px] relative size-full">
        <Container90 />
        <Container91 />
      </div>
    </div>
  );
}

function Container88() {
  return (
    <div className="bg-white h-[108px] relative rounded-[10px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-2 border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="content-stretch flex flex-col items-start p-[2px] relative size-full">
        <Container89 />
      </div>
    </div>
  );
}

function Container39() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] h-[1289px] items-start relative shrink-0 w-full" data-name="Container">
      <Container40 />
      <Container47 />
      <Container53 />
      <Container59 />
      <Container66 />
      <Container70 />
      <Container78 />
      <Container88 />
    </div>
  );
}

function Container38() {
  return (
    <div className="bg-[#f9fafb] flex-[1_0_0] h-[552px] min-h-px min-w-px relative" data-name="Container">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pl-[24px] pr-[39px] pt-[24px] relative size-full">
          <Container39 />
        </div>
      </div>
    </div>
  );
}

function Container37() {
  return (
    <div className="flex-[1_0_0] h-[552px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start overflow-clip relative rounded-[inherit] size-full">
        <Container38 />
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[628px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start overflow-clip relative rounded-[inherit] size-full">
        <Container15 />
        <Container37 />
      </div>
    </div>
  );
}

function Div1() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[785px] items-start left-0 overflow-clip top-0 w-[628px]" data-name="div">
      <Container4 />
      <Container14 />
    </div>
  );
}

function H3() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="h3">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[28px] left-0 not-italic text-[#101828] text-[18px] top-[-1px] whitespace-nowrap">Xem trước trực tiếp</p>
    </div>
  );
}

function P2() {
  return (
    <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="p">
      <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[20px] min-h-px min-w-px not-italic relative text-[#6a7282] text-[14px]">Cập nhật tự động</p>
    </div>
  );
}

function Container94() {
  return (
    <div className="h-[48px] relative shrink-0 w-[159.859px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <H3 />
        <P2 />
      </div>
    </div>
  );
}

function Container95() {
  return (
    <div className="h-[20px] relative shrink-0 w-[54.359px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#6a7282] text-[14px] whitespace-nowrap">A4 - Dọc</p>
      </div>
    </div>
  );
}

function Container93() {
  return (
    <div className="content-stretch flex h-[48px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Container94 />
      <Container95 />
    </div>
  );
}

function Container92() {
  return (
    <div className="bg-white h-[81px] relative shrink-0 w-[628px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0.1)] border-b border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-px pt-[16px] px-[16px] relative size-full">
        <Container93 />
      </div>
    </div>
  );
}

function Svg() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="svg">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="svg">
          <path d={svgPaths.p3161fe80} id="Vector" stroke="var(--stroke-0, #155DFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Container101() {
  return (
    <div className="bg-[#dbeafe] relative rounded-[4px] shrink-0 size-[32px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Svg />
      </div>
    </div>
  );
}

function P3() {
  return (
    <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="p">
      <p className="flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[20px] min-h-px min-w-px not-italic relative text-[#101828] text-[14px]">A4 - Dọc</p>
    </div>
  );
}

function P4() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="p">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#6a7282] text-[12px] whitespace-nowrap">210mm × 297mm</p>
    </div>
  );
}

function Container102() {
  return (
    <div className="flex-[1_0_0] h-[36px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <P3 />
        <P4 />
      </div>
    </div>
  );
}

function Container100() {
  return (
    <div className="h-[36px] relative shrink-0 w-[138.953px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
        <Container101 />
        <Container102 />
      </div>
    </div>
  );
}

function P5() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="p">
      <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[16px] min-h-px min-w-px not-italic relative text-[#6a7282] text-[12px] text-right">Lề (TPDT)</p>
    </div>
  );
}

function P6() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="p">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#364153] text-[12px] text-right whitespace-nowrap">20/20/20/20mm</p>
    </div>
  );
}

function Container103() {
  return (
    <div className="h-[32px] relative shrink-0 w-[89.484px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <P5 />
        <P6 />
      </div>
    </div>
  );
}

function Container99() {
  return (
    <div className="bg-white h-[60px] relative rounded-[10px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[12px] relative size-full">
          <Container100 />
          <Container103 />
        </div>
      </div>
    </div>
  );
}

function Container105() {
  return <div className="absolute border-2 border-[#bedbff] border-solid h-[776.438px] left-0 top-0 w-[549px]" data-name="Container" />;
}

function Container106() {
  return (
    <div className="absolute bg-[#2b7fff] content-stretch flex h-[24px] items-start left-[8px] px-[8px] py-[4px] rounded-[4px] top-[8px] w-[102.406px]" data-name="Container">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap">Vùng an toàn in</p>
    </div>
  );
}

function Heading() {
  return (
    <div className="h-[36px] relative shrink-0 w-full" data-name="Heading 1">
      <p className="-translate-x-1/2 absolute font-['Inter:Bold',sans-serif] font-bold leading-[36px] left-[234.84px] not-italic text-[#1e88e5] text-[24px] text-center top-[-1px] whitespace-nowrap">CỬA HÀNG VLXD XƯƠNG LUÂN</p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[18px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[234.59px] not-italic text-[#0a0a0a] text-[12px] text-center top-0 whitespace-nowrap">123 Đường Võ Văn Tần, Quận 3, TP.HCM</p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[18px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[234.58px] not-italic text-[#0a0a0a] text-[12px] text-center top-0 whitespace-nowrap">ĐT: 028 1234 5678 • Email: info@vlxdxuonglan.vn</p>
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="h-[18px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[234.88px] not-italic text-[#0a0a0a] text-[12px] text-center top-0 whitespace-nowrap">MST: 0123456789</p>
    </div>
  );
}

function Container109() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[5px] h-[105px] items-start left-[20px] top-[20px] w-[469px]" data-name="Container">
      <Heading />
      <Paragraph />
      <Paragraph1 />
      <Paragraph2 />
    </div>
  );
}

function Heading1() {
  return (
    <div className="h-[36px] relative shrink-0 w-full" data-name="Heading 2">
      <p className="-translate-x-1/2 absolute font-['Inter:Bold',sans-serif] font-bold leading-[36px] left-[234.92px] not-italic text-[#0a0a0a] text-[24px] text-center top-[-1px] whitespace-nowrap">HÓA ĐƠN BÁN HÀNG</p>
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="h-[18px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Inter:Bold',sans-serif] font-bold leading-[18px] left-[234.64px] not-italic text-[#1e88e5] text-[12px] text-center top-0 whitespace-nowrap">HD-001</p>
    </div>
  );
}

function Container110() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[10px] h-[108px] items-start left-[20px] pb-[2px] pt-[17px] top-[145px] w-[469px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#1e88e5] border-b-2 border-solid border-t-2 inset-0 pointer-events-none" />
      <Heading1 />
      <Paragraph3 />
    </div>
  );
}

function Paragraph4() {
  return (
    <div className="col-1 justify-self-stretch relative row-1 self-stretch shrink-0" data-name="Paragraph">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[0] left-0 not-italic text-[#0a0a0a] text-[0px] text-[12px] top-0 whitespace-nowrap">
        <span className="leading-[18px]">Ngày tạo:</span>
        <span className="font-['Inter:Regular',sans-serif] font-normal leading-[18px]">{` 24/02/2026`}</span>
      </p>
    </div>
  );
}

function Paragraph5() {
  return (
    <div className="col-2 justify-self-stretch relative row-1 self-stretch shrink-0" data-name="Paragraph">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[0] left-0 not-italic text-[#0a0a0a] text-[0px] text-[12px] top-0 whitespace-nowrap">
        <span className="leading-[18px]">Ngày đến hạn:</span>
        <span className="font-['Inter:Regular',sans-serif] font-normal leading-[18px]">{` 26/03/2026`}</span>
      </p>
    </div>
  );
}

function Container111() {
  return (
    <div className="absolute gap-x-[20px] gap-y-[20px] grid grid-cols-[repeat(2,minmax(0,1fr))] grid-rows-[repeat(1,minmax(0,1fr))] h-[18px] left-[20px] top-[273px] w-[469px]" data-name="Container">
      <Paragraph4 />
      <Paragraph5 />
    </div>
  );
}

function Paragraph6() {
  return (
    <div className="h-[18px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[0] left-0 not-italic text-[#0a0a0a] text-[0px] text-[12px] top-0 whitespace-nowrap">
        <span className="leading-[18px]">Khách hàng:</span>
        <span className="font-['Inter:Regular',sans-serif] font-normal leading-[18px]">{` Anh Hòa Q.1`}</span>
      </p>
    </div>
  );
}

function Paragraph7() {
  return (
    <div className="h-[18px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[0] left-0 not-italic text-[#0a0a0a] text-[0px] text-[12px] top-0 whitespace-nowrap">
        <span className="leading-[18px]">Địa chỉ:</span>
        <span className="font-['Inter:Regular',sans-serif] font-normal leading-[18px]">{` 456 Đường Lê Lợi, Quận 1, TP.HCM`}</span>
      </p>
    </div>
  );
}

function Paragraph8() {
  return (
    <div className="h-[18px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[0] left-0 not-italic text-[#0a0a0a] text-[0px] text-[12px] top-0 whitespace-nowrap">
        <span className="leading-[18px]">Điện thoại:</span>
        <span className="font-['Inter:Regular',sans-serif] font-normal leading-[18px]">{` 0901 234 567`}</span>
      </p>
    </div>
  );
}

function Container112() {
  return (
    <div className="absolute content-stretch flex flex-col h-[54px] items-start left-[20px] top-[311px] w-[469px]" data-name="Container">
      <Paragraph6 />
      <Paragraph7 />
      <Paragraph8 />
    </div>
  );
}

function HeaderCell() {
  return (
    <div className="absolute border border-[#ddd] border-solid h-[39px] left-0 top-0 w-[44.906px]" data-name="Header Cell">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[18px] left-[9.5px] not-italic text-[12px] text-white top-[9.5px] whitespace-nowrap">STT</p>
    </div>
  );
}

function HeaderCell1() {
  return (
    <div className="absolute border border-[#ddd] border-solid h-[39px] left-[44.91px] top-0 w-[144.688px]" data-name="Header Cell">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[18px] left-[9.5px] not-italic text-[12px] text-white top-[9.5px] whitespace-nowrap">Tên hàng</p>
    </div>
  );
}

function HeaderCell2() {
  return (
    <div className="absolute border border-[#ddd] border-solid h-[39px] left-[189.59px] top-0 w-[49.359px]" data-name="Header Cell">
      <p className="-translate-x-1/2 absolute font-['Inter:Bold',sans-serif] font-bold leading-[18px] left-[23.81px] not-italic text-[12px] text-center text-white top-[9.5px] whitespace-nowrap">ĐVT</p>
    </div>
  );
}

function HeaderCell3() {
  return (
    <div className="absolute border border-[#ddd] border-solid h-[39px] left-[238.95px] top-0 w-[37.578px]" data-name="Header Cell">
      <p className="-translate-x-full absolute font-['Inter:Bold',sans-serif] font-bold leading-[18px] left-[26.41px] not-italic text-[12px] text-right text-white top-[9.5px] whitespace-nowrap">SL</p>
    </div>
  );
}

function HeaderCell4() {
  return (
    <div className="absolute border border-[#ddd] border-solid h-[39px] left-[276.53px] top-0 w-[93.422px]" data-name="Header Cell">
      <p className="-translate-x-full absolute font-['Inter:Bold',sans-serif] font-bold leading-[18px] left-[82.53px] not-italic text-[12px] text-right text-white top-[9.5px] whitespace-nowrap">Đơn giá</p>
    </div>
  );
}

function HeaderCell5() {
  return (
    <div className="absolute border border-[#ddd] border-solid h-[39px] left-[369.95px] top-0 w-[98.047px]" data-name="Header Cell">
      <p className="-translate-x-full absolute font-['Inter:Bold',sans-serif] font-bold leading-[18px] left-[86.77px] not-italic text-[12px] text-right text-white top-[9.5px] whitespace-nowrap">Thành tiền</p>
    </div>
  );
}

function TableRow() {
  return (
    <div className="absolute bg-[#1e88e5] h-[39px] left-0 top-0 w-[468px]" data-name="Table Row">
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
    <div className="absolute h-[39px] left-[0.5px] top-[0.5px] w-[468px]" data-name="Table Header">
      <TableRow />
    </div>
  );
}

function TableCell() {
  return (
    <div className="absolute border border-[#ddd] border-solid h-[53px] left-0 top-0 w-[44.906px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[7.5px] not-italic text-[#0a0a0a] text-[12px] top-[16.5px] whitespace-nowrap">1</p>
    </div>
  );
}

function TableCell1() {
  return (
    <div className="absolute border border-[#ddd] border-solid h-[53px] left-[44.91px] top-0 w-[144.688px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[7.5px] not-italic text-[#0a0a0a] text-[12px] top-[7.5px] w-[96px]">Ván nhựa Alcado 20cm x 3m</p>
    </div>
  );
}

function TableCell2() {
  return (
    <div className="absolute border border-[#ddd] border-solid h-[53px] left-[189.59px] top-0 w-[49.359px]" data-name="Table Cell">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[23.66px] not-italic text-[#0a0a0a] text-[12px] text-center top-[16.5px] whitespace-nowrap">Tấm</p>
    </div>
  );
}

function TableCell3() {
  return (
    <div className="absolute border border-[#ddd] border-solid h-[53px] left-[238.95px] top-0 w-[37.578px]" data-name="Table Cell">
      <p className="-translate-x-full absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[28.28px] not-italic text-[#0a0a0a] text-[12px] text-right top-[16.5px] whitespace-nowrap">50</p>
    </div>
  );
}

function TableCell4() {
  return (
    <div className="absolute border border-[#ddd] border-solid h-[53px] left-[276.53px] top-0 w-[93.422px]" data-name="Table Cell">
      <p className="-translate-x-full absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[84.5px] not-italic text-[#0a0a0a] text-[12px] text-right top-[16.5px] whitespace-nowrap">320.000 ₫</p>
    </div>
  );
}

function TableCell5() {
  return (
    <div className="absolute border border-[#ddd] border-solid h-[53px] left-[369.95px] top-0 w-[98.047px]" data-name="Table Cell">
      <p className="-translate-x-full absolute font-['Inter:Bold',sans-serif] font-bold leading-[18px] left-[89.08px] not-italic text-[#0a0a0a] text-[12px] text-right top-[16.5px] whitespace-nowrap">16.000.000 ₫</p>
    </div>
  );
}

function TableRow1() {
  return (
    <div className="absolute h-[53px] left-0 top-0 w-[468px]" data-name="Table Row">
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
    <div className="absolute border border-[#ddd] border-solid h-[53px] left-0 top-0 w-[44.906px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[7.5px] not-italic text-[#0a0a0a] text-[12px] top-[16.5px] whitespace-nowrap">2</p>
    </div>
  );
}

function TableCell7() {
  return (
    <div className="absolute border border-[#ddd] border-solid h-[53px] left-[44.91px] top-0 w-[144.688px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[7.5px] not-italic text-[#0a0a0a] text-[12px] top-[7.5px] w-[110px]">Quần jeans nữ Blue Exchange size M</p>
    </div>
  );
}

function TableCell8() {
  return (
    <div className="absolute border border-[#ddd] border-solid h-[53px] left-[189.59px] top-0 w-[49.359px]" data-name="Table Cell">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[24px] not-italic text-[#0a0a0a] text-[12px] text-center top-[16.5px] whitespace-nowrap">Cái</p>
    </div>
  );
}

function TableCell9() {
  return (
    <div className="absolute border border-[#ddd] border-solid h-[53px] left-[238.95px] top-0 w-[37.578px]" data-name="Table Cell">
      <p className="-translate-x-full absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[28.5px] not-italic text-[#0a0a0a] text-[12px] text-right top-[16.5px] whitespace-nowrap">100</p>
    </div>
  );
}

function TableCell10() {
  return (
    <div className="absolute border border-[#ddd] border-solid h-[53px] left-[276.53px] top-0 w-[93.422px]" data-name="Table Cell">
      <p className="-translate-x-full absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[84.84px] not-italic text-[#0a0a0a] text-[12px] text-right top-[16.5px] whitespace-nowrap">250.000 ₫</p>
    </div>
  );
}

function TableCell11() {
  return (
    <div className="absolute border border-[#ddd] border-solid h-[53px] left-[369.95px] top-0 w-[98.047px]" data-name="Table Cell">
      <p className="-translate-x-full absolute font-['Inter:Bold',sans-serif] font-bold leading-[18px] left-[89.5px] not-italic text-[#0a0a0a] text-[12px] text-right top-[16.5px] whitespace-nowrap">25.000.000 ₫</p>
    </div>
  );
}

function TableRow2() {
  return (
    <div className="absolute h-[53px] left-0 top-[53px] w-[468px]" data-name="Table Row">
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
    <div className="absolute border border-[#ddd] border-solid h-[53px] left-0 top-0 w-[44.906px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[7.5px] not-italic text-[#0a0a0a] text-[12px] top-[16.5px] whitespace-nowrap">3</p>
    </div>
  );
}

function TableCell13() {
  return (
    <div className="absolute border border-[#ddd] border-solid h-[53px] left-[44.91px] top-0 w-[144.688px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[7.5px] not-italic text-[#0a0a0a] text-[12px] top-[7.5px] w-[105px]">iPhone 15 Pro Max 256GB</p>
    </div>
  );
}

function TableCell14() {
  return (
    <div className="absolute border border-[#ddd] border-solid h-[53px] left-[189.59px] top-0 w-[49.359px]" data-name="Table Cell">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[24px] not-italic text-[#0a0a0a] text-[12px] text-center top-[16.5px] whitespace-nowrap">Chiếc</p>
    </div>
  );
}

function TableCell15() {
  return (
    <div className="absolute border border-[#ddd] border-solid h-[53px] left-[238.95px] top-0 w-[37.578px]" data-name="Table Cell">
      <p className="-translate-x-full absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[28.81px] not-italic text-[#0a0a0a] text-[12px] text-right top-[16.5px] whitespace-nowrap">2</p>
    </div>
  );
}

function TableCell16() {
  return (
    <div className="absolute border border-[#ddd] border-solid h-[53px] left-[276.53px] top-0 w-[93.422px]" data-name="Table Cell">
      <p className="-translate-x-full absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[84.5px] not-italic text-[#0a0a0a] text-[12px] text-right top-[16.5px] whitespace-nowrap">32.000.000 ₫</p>
    </div>
  );
}

function TableCell17() {
  return (
    <div className="absolute border border-[#ddd] border-solid h-[53px] left-[369.95px] top-0 w-[98.047px]" data-name="Table Cell">
      <p className="-translate-x-full absolute font-['Inter:Bold',sans-serif] font-bold leading-[18px] left-[88.89px] not-italic text-[#0a0a0a] text-[12px] text-right top-[16.5px] whitespace-nowrap">4.200.000 ₫</p>
    </div>
  );
}

function TableRow3() {
  return (
    <div className="absolute h-[53px] left-0 top-[106px] w-[468px]" data-name="Table Row">
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
    <div className="absolute h-[159px] left-[0.5px] top-[39.5px] w-[468px]" data-name="Table Body">
      <TableRow1 />
      <TableRow2 />
      <TableRow3 />
    </div>
  );
}

function Table1() {
  return (
    <div className="absolute h-[199px] left-[20px] top-[385px] w-[469px]" data-name="Table">
      <TableHeader />
      <TableBody />
    </div>
  );
}

function Text() {
  return (
    <div className="h-[18px] relative shrink-0 w-[52.031px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-0 not-italic text-[#0a0a0a] text-[12px] top-0 whitespace-nowrap">Tạm tính:</p>
      </div>
    </div>
  );
}

function Text1() {
  return (
    <div className="h-[18px] relative shrink-0 w-[76.266px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-0 not-italic text-[#0a0a0a] text-[12px] top-0 whitespace-nowrap">45.200.000 ₫</p>
      </div>
    </div>
  );
}

function Container115() {
  return (
    <div className="content-stretch flex h-[35px] items-start justify-between pb-px pt-[8px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#ddd] border-b border-solid inset-0 pointer-events-none" />
      <Text />
      <Text1 />
    </div>
  );
}

function Text2() {
  return (
    <div className="h-[27px] relative shrink-0 w-[116.516px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[27px] left-0 not-italic text-[#1e88e5] text-[18px] top-px whitespace-nowrap">TỔNG CỘNG:</p>
      </div>
    </div>
  );
}

function Text3() {
  return (
    <div className="h-[27px] relative shrink-0 w-[121.922px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[27px] left-0 not-italic text-[#1e88e5] text-[18px] top-px whitespace-nowrap">45.200.000 ₫</p>
      </div>
    </div>
  );
}

function Container116() {
  return (
    <div className="content-stretch flex h-[45px] items-start justify-between pb-[2px] pt-[8px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#1e88e5] border-b-2 border-solid inset-0 pointer-events-none" />
      <Text2 />
      <Text3 />
    </div>
  );
}

function Text4() {
  return (
    <div className="h-[18px] relative shrink-0 w-[83.172px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-0 not-italic text-[12px] text-[green] top-0 whitespace-nowrap">Đã thanh toán:</p>
      </div>
    </div>
  );
}

function Text5() {
  return (
    <div className="h-[18px] relative shrink-0 w-[76.359px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-0 not-italic text-[12px] text-[green] top-0 whitespace-nowrap">30.000.000 ₫</p>
      </div>
    </div>
  );
}

function Container117() {
  return (
    <div className="content-stretch flex h-[34px] items-start justify-between pt-[8px] relative shrink-0 w-full" data-name="Container">
      <Text4 />
      <Text5 />
    </div>
  );
}

function Text6() {
  return (
    <div className="h-[18px] relative shrink-0 w-[43.703px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[18px] left-0 not-italic text-[12px] text-[orange] top-0 whitespace-nowrap">Còn lại:</p>
      </div>
    </div>
  );
}

function Text7() {
  return (
    <div className="h-[18px] relative shrink-0 w-[79.031px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[18px] left-0 not-italic text-[12px] text-[orange] top-0 whitespace-nowrap">15.200.000 ₫</p>
      </div>
    </div>
  );
}

function Container118() {
  return (
    <div className="content-stretch flex h-[34px] items-start justify-between pt-[8px] relative shrink-0 w-full" data-name="Container">
      <Text6 />
      <Text7 />
    </div>
  );
}

function Container114() {
  return (
    <div className="h-[148px] relative shrink-0 w-[300px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container115 />
        <Container116 />
        <Container117 />
        <Container118 />
      </div>
    </div>
  );
}

function Container113() {
  return (
    <div className="absolute content-stretch flex h-[148px] items-start justify-end left-[20px] top-[614px] w-[469px]" data-name="Container">
      <Container114 />
    </div>
  );
}

function Paragraph9() {
  return (
    <div className="h-[18px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Inter:Bold',sans-serif] font-bold leading-[18px] left-[107.3px] not-italic text-[#0a0a0a] text-[12px] text-center top-0 whitespace-nowrap">Người bán hàng</p>
    </div>
  );
}

function Paragraph10() {
  return (
    <div className="h-[18px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[107.7px] not-italic text-[#999] text-[12px] text-center top-0 whitespace-nowrap">(Ký và ghi rõ họ tên)</p>
    </div>
  );
}

function Container120() {
  return (
    <div className="col-1 content-stretch flex flex-col gap-[60px] items-start justify-self-stretch relative row-1 self-stretch shrink-0" data-name="Container">
      <Paragraph9 />
      <Paragraph10 />
    </div>
  );
}

function Paragraph11() {
  return (
    <div className="h-[18px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Inter:Bold',sans-serif] font-bold leading-[18px] left-[107.45px] not-italic text-[#0a0a0a] text-[12px] text-center top-0 whitespace-nowrap">Khách hàng</p>
    </div>
  );
}

function Paragraph12() {
  return (
    <div className="h-[18px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[107.7px] not-italic text-[#999] text-[12px] text-center top-0 whitespace-nowrap">(Ký và ghi rõ họ tên)</p>
    </div>
  );
}

function Container121() {
  return (
    <div className="col-2 content-stretch flex flex-col gap-[60px] items-start justify-self-stretch relative row-1 self-stretch shrink-0" data-name="Container">
      <Paragraph11 />
      <Paragraph12 />
    </div>
  );
}

function Container119() {
  return (
    <div className="absolute gap-x-[40px] gap-y-[40px] grid grid-cols-[repeat(2,minmax(0,1fr))] grid-rows-[repeat(1,minmax(0,1fr))] h-[96px] left-[20px] top-[812px] w-[469px]" data-name="Container">
      <Container120 />
      <Container121 />
    </div>
  );
}

function Paragraph13() {
  return (
    <div className="absolute h-[18px] left-[20px] top-[938px] w-[469px]" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Inter:Italic',sans-serif] font-normal italic leading-[18px] left-[234.83px] text-[#666] text-[12px] text-center top-0 whitespace-nowrap">Cảm ơn quý khách đã tin tưởng sử dụng sản phẩm của chúng tôi!</p>
    </div>
  );
}

function Container108() {
  return (
    <div className="h-[976px] relative shrink-0 w-full" data-name="Container">
      <Container109 />
      <Container110 />
      <Container111 />
      <Container112 />
      <Table1 />
      <Container113 />
      <Container119 />
      <Paragraph13 />
    </div>
  );
}

function Container107() {
  return (
    <div className="absolute content-stretch flex flex-col h-[776.438px] items-start left-0 overflow-clip pt-[20px] px-[20px] top-0 w-[549px]" data-name="Container">
      <Container108 />
    </div>
  );
}

function Container104() {
  return (
    <div className="bg-white h-[776.438px] relative shadow-[0px_25px_50px_0px_rgba(0,0,0,0.25)] shrink-0 w-full" data-name="Container">
      <Container105 />
      <Container106 />
      <Container107 />
    </div>
  );
}

function Container124() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[12px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-2 border-[#bedbff] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Span9() {
  return (
    <div className="flex-[1_0_0] h-[16px] min-h-px min-w-px relative" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#4a5565] text-[12px] whitespace-nowrap">Lề trang</p>
      </div>
    </div>
  );
}

function Container123() {
  return (
    <div className="h-[16px] relative shrink-0 w-[59.422px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center relative size-full">
        <Container124 />
        <Span9 />
      </div>
    </div>
  );
}

function Container126() {
  return <div className="bg-white rounded-[4px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] shrink-0 size-[12px]" data-name="Container" />;
}

function Span10() {
  return (
    <div className="flex-[1_0_0] h-[16px] min-h-px min-w-px relative" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#4a5565] text-[12px] whitespace-nowrap">Vùng in</p>
      </div>
    </div>
  );
}

function Container125() {
  return (
    <div className="h-[16px] relative shrink-0 w-[57.094px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center relative size-full">
        <Container126 />
        <Span10 />
      </div>
    </div>
  );
}

function Container122() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex gap-[16px] items-center justify-center pr-[0.016px] relative size-full">
          <Container123 />
          <Container125 />
        </div>
      </div>
    </div>
  );
}

function Container98() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[12px] h-[876.438px] items-start left-0 top-0 w-[549px]" data-name="Container">
      <Container99 />
      <Container104 />
      <Container122 />
    </div>
  );
}

function Container97() {
  return (
    <div className="h-[876.438px] relative shrink-0 w-full" data-name="Container">
      <Container98 />
    </div>
  );
}

function Container96() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[628px]" data-name="Container">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pl-[32px] pr-[47px] pt-[32px] relative size-full">
          <Container97 />
        </div>
      </div>
    </div>
  );
}

function Div22() {
  return (
    <div className="absolute bg-[#f3f4f6] content-stretch flex flex-col h-[785px] items-start left-[632px] overflow-clip top-0 w-[628px]" data-name="div">
      <Container92 />
      <Container96 />
    </div>
  );
}

function PanelResizeHandle() {
  return <div className="absolute bg-[#e5e7eb] h-[785px] left-[628px] top-0 w-[4px]" data-name="PanelResizeHandle" />;
}

function PanelGroup() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[1260px]" data-name="PanelGroup">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <Div1 />
        <Div22 />
        <PanelResizeHandle />
      </div>
    </div>
  );
}

function MainContent() {
  return (
    <div className="absolute bg-[#f9fafb] content-stretch flex flex-col h-[870px] items-start left-[280px] top-[88px] w-[1260px]" data-name="Main Content">
      <Container />
      <PanelGroup />
    </div>
  );
}

function Section() {
  return <div className="absolute h-0 left-0 top-[982px] w-[1564px]" data-name="Section" />;
}

function Div() {
  return (
    <div className="bg-[#f9fafb] h-[982px] relative shrink-0 w-full" data-name="div">
      <MainContent />
      <Section />
    </div>
  );
}

function Body() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[870px] items-start left-0 top-0 w-[1564px]" data-name="Body">
      <Div />
    </div>
  );
}

function Input5() {
  return (
    <div className="absolute bg-[#f3f3f5] h-[36px] left-0 rounded-[8px] top-0 w-[384px]" data-name="Input">
      <div className="content-stretch flex items-center overflow-clip pl-[40px] pr-[12px] py-[4px] relative rounded-[inherit] size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#717182] text-[14px] whitespace-nowrap">Tìm kiếm hóa đơn, khách hàng...</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Search() {
  return (
    <div className="absolute left-[12px] size-[16px] top-[10px]" data-name="Search">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Search">
          <path d={svgPaths.p107a080} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M14 14L11.1333 11.1333" id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container128() {
  return (
    <div className="absolute h-[36px] left-0 top-0 w-[384px]" data-name="Container">
      <Input5 />
      <Search />
    </div>
  );
}

function Container127() {
  return (
    <div className="flex-[1_0_0] h-[36px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container128 />
      </div>
    </div>
  );
}

function User() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="User">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="User">
          <path d={svgPaths.p399eca00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.pc93b400} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Div24() {
  return (
    <div className="bg-[#1e88e5] relative rounded-[33554400px] shrink-0 size-[32px]" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <User />
      </div>
    </div>
  );
}

function Container130() {
  return (
    <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[#0a0a0a] text-[14px] whitespace-nowrap">Nguyễn Văn An</p>
    </div>
  );
}

function Container131() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[16px] min-h-px min-w-px not-italic relative text-[#6a7282] text-[12px]">Quản trị viên</p>
    </div>
  );
}

function Div25() {
  return (
    <div className="h-[36px] relative shrink-0 w-[98.875px]" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container130 />
        <Container131 />
      </div>
    </div>
  );
}

function Button15() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[36px] items-center justify-center left-[52px] rounded-[8px] top-0 w-[170.875px]" data-name="Button">
      <Div24 />
      <Div25 />
    </div>
  );
}

function Bell() {
  return (
    <div className="absolute left-[10px] size-[16px] top-[10px]" data-name="Bell">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Bell">
          <path d={svgPaths.p1ce3c700} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1a06de00} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text8() {
  return <div className="absolute bg-[#ff6467] left-[-1.54px] opacity-46 rounded-[33554400px] size-[11.078px] top-[-1.54px]" data-name="Text" />;
}

function Text9() {
  return <div className="absolute bg-[#fb2c36] left-0 rounded-[33554400px] size-[8px] top-0" data-name="Text" />;
}

function Span11() {
  return (
    <div className="absolute left-[24px] size-[8px] top-[4px]" data-name="span">
      <Text8 />
      <Text9 />
    </div>
  );
}

function Button16() {
  return (
    <div className="absolute left-0 rounded-[8px] size-[36px] top-0" data-name="Button">
      <Bell />
      <Span11 />
    </div>
  );
}

function Container129() {
  return (
    <div className="h-[36px] relative shrink-0 w-[222.875px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Button15 />
        <Button16 />
      </div>
    </div>
  );
}

function Div23() {
  return (
    <div className="h-[63px] relative shrink-0 w-full" data-name="div">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[24px] relative size-full">
          <Container127 />
          <Container129 />
        </div>
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[64px] items-start left-[256px] pb-px top-0 w-[1308px]" data-name="header">
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0.1)] border-b border-solid inset-0 pointer-events-none" />
      <Div23 />
    </div>
  );
}

function FileText() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="FileText">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="FileText">
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

function Container133() {
  return (
    <div className="bg-[#1e88e5] relative rounded-[10px] shrink-0 size-[40px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <FileText />
      </div>
    </div>
  );
}

function H1() {
  return (
    <div className="h-[36px] relative shrink-0 w-full" data-name="h1">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[36px] left-0 not-italic text-[#101828] text-[24px] top-[-2px] whitespace-nowrap">Invoice Pro</p>
    </div>
  );
}

function P7() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="p">
      <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[16px] min-h-px min-w-px not-italic relative text-[#6a7282] text-[12px]">Quản lý hóa đơn</p>
    </div>
  );
}

function Container134() {
  return (
    <div className="flex-[1_0_0] h-[52px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <H1 />
        <P7 />
      </div>
    </div>
  );
}

function Container132() {
  return (
    <div className="h-[52px] relative shrink-0 w-[169.266px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Container133 />
        <Container134 />
      </div>
    </div>
  );
}

function Div26() {
  return (
    <div className="absolute content-stretch flex h-[64px] items-center justify-between left-0 pb-px pl-[24px] pr-[61.734px] top-0 w-[255px]" data-name="div">
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0.1)] border-b border-solid inset-0 pointer-events-none" />
      <Container132 />
    </div>
  );
}

function Icon() {
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
        <Icon />
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[48px] not-italic text-[#364153] text-[14px] top-[11px] whitespace-nowrap">Dashboard</p>
      </div>
    </div>
  );
}

function Icon1() {
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
        <Icon1 />
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[48px] not-italic text-[#364153] text-[14px] top-[11px] whitespace-nowrap">Hóa đơn</p>
      </div>
    </div>
  );
}

function Icon2() {
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
        <Icon2 />
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[48px] not-italic text-[#364153] text-[14px] top-[11px] whitespace-nowrap">Báo giá</p>
      </div>
    </div>
  );
}

function Icon3() {
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
        <Icon3 />
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[48px] not-italic text-[#364153] text-[14px] top-[11px] whitespace-nowrap">Công nợ</p>
      </div>
    </div>
  );
}

function Icon4() {
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
        <Icon4 />
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[48px] not-italic text-[#364153] text-[14px] top-[11px] whitespace-nowrap">Khách hàng</p>
      </div>
    </div>
  );
}

function Icon5() {
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
        <Icon5 />
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[48px] not-italic text-[#364153] text-[14px] top-[11px] whitespace-nowrap">Mặt hàng</p>
      </div>
    </div>
  );
}

function Icon6() {
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
        <Icon6 />
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[48px] not-italic text-[#364153] text-[14px] top-[11px] whitespace-nowrap">Báo cáo</p>
      </div>
    </div>
  );
}

function Icon7() {
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
        <Icon7 />
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[48px] not-italic text-[#364153] text-[14px] top-[11px] whitespace-nowrap">Cài đặt</p>
      </div>
    </div>
  );
}

function Nav() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] h-[412px] items-start left-0 pl-[16px] py-[16px] top-[64px] w-[255px]" data-name="nav">
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

function ChevronLeft() {
  return (
    <div className="absolute left-[74.06px] size-[16px] top-[8px]" data-name="ChevronLeft">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="ChevronLeft">
          <path d="M10 12L6 8L10 4" id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Span12() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[96.06px] top-[6px] w-[52.859px]" data-name="span">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[#0a0a0a] text-[14px] text-center whitespace-nowrap">Thu gọn</p>
    </div>
  );
}

function Button17() {
  return (
    <div className="absolute h-[32px] left-[16px] rounded-[8px] top-[822px] w-[223px]" data-name="Button">
      <ChevronLeft />
      <Span12 />
    </div>
  );
}

function Aside() {
  return (
    <div className="absolute bg-white border-[rgba(0,0,0,0.1)] border-r border-solid h-[870px] left-0 top-0 w-[256px]" data-name="aside">
      <Div26 />
      <Nav />
      <Button17 />
    </div>
  );
}

export default function WebBasedInvoiceManagementSystem() {
  return (
    <div className="bg-white relative size-full" data-name="Web-based Invoice Management System">
      <Body />
      <Header />
      <Aside />
    </div>
  );
}