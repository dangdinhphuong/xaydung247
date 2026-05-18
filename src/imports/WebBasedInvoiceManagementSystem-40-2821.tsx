import svgPaths from "./svg-okb7bu6ohh";
import imgCanvas from "figma:asset/029ac879f755c35349ebc66fe327e6690b5319ad.png";

function ArrowLeft() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="ArrowLeft">
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
      <p className="font-['Inter:Bold',sans-serif] font-bold leading-[32px] not-italic relative shrink-0 text-[#101828] text-[24px]">Trình chỉnh sửa mẫu hóa đơn</p>
    </div>
  );
}

function P() {
  return (
    <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="p">
      <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[20px] min-h-px min-w-px not-italic relative text-[#6a7282] text-[14px] whitespace-pre-wrap">Chế độ HTML</p>
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

function CheckCircle() {
  return (
    <div className="absolute left-[12px] size-[14px] top-[7px]" data-name="CheckCircle2">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_39_1277)" id="Icon">
          <path d={svgPaths.pc012c00} id="Vector" stroke="var(--stroke-0, #008236)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p24f94f00} id="Vector_2" stroke="var(--stroke-0, #008236)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
        <defs>
          <clipPath id="clip0_39_1277">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container4() {
  return (
    <div className="bg-[#dcfce7] h-[28px] relative rounded-[33554400px] shrink-0 w-[82.219px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <CheckCircle />
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-[34px] not-italic text-[#008236] text-[12px] top-[6px]">Hợp lệ</p>
      </div>
    </div>
  );
}

function Eye() {
  return (
    <div className="absolute left-[11px] size-[16px] top-[8px]" data-name="Eye">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
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
        <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[74px] not-italic text-[#0a0a0a] text-[14px] text-center top-[5px]">Xem trước</p>
      </div>
    </div>
  );
}

function FileDown() {
  return (
    <div className="absolute left-[11px] size-[16px] top-[8px]" data-name="FileDown">
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

function Button1() {
  return (
    <div className="bg-white h-[32px] relative rounded-[8px] shrink-0 w-[110.313px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <FileDown />
        <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[70px] not-italic text-[#0a0a0a] text-[14px] text-center top-[5px]">Xuất PDF</p>
      </div>
    </div>
  );
}

function Save() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Save">
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

function Span() {
  return (
    <div className="h-[20px] relative shrink-0 w-[23.75px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-white">Lưu</p>
      </div>
    </div>
  );
}

function Button2() {
  return (
    <div className="bg-[#1e88e5] h-[32px] relative rounded-[8px] shrink-0 w-[73.75px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[14px] items-center justify-center relative size-full">
        <Save />
        <Span />
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="h-[32px] relative shrink-0 w-[408.766px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Container4 />
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

function H2() {
  return (
    <div className="h-[27px] relative shrink-0 w-full" data-name="h3">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[27px] left-0 not-italic text-[#101828] text-[18px] top-[-1px]">Công cụ HTML</p>
    </div>
  );
}

function P1() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="p">
      <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[16px] min-h-px min-w-px not-italic relative text-[#6a7282] text-[12px] whitespace-pre-wrap">Chèn biến và đoạn mã</p>
    </div>
  );
}

function Container8() {
  return (
    <div className="h-[80px] relative shrink-0 w-[319px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0.1)] border-b border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start pb-px pt-[16px] px-[16px] relative size-full">
        <H2 />
        <P1 />
      </div>
    </div>
  );
}

function Label() {
  return (
    <div className="content-stretch flex h-[20px] items-center relative shrink-0 w-full" data-name="Label">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic relative shrink-0 text-[#0a0a0a] text-[14px]">Chèn biến</p>
    </div>
  );
}

function ChevronDown() {
  return (
    <div className="absolute left-[258px] size-[16px] top-[10px]" data-name="ChevronDown">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M4 6L8 10L12 6" id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button3() {
  return (
    <div className="bg-white h-[36px] relative rounded-[8px] shrink-0 w-full" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[45.5px] not-italic text-[#0a0a0a] text-[14px] text-center top-[7px]">Chọn biến</p>
      <ChevronDown />
    </div>
  );
}

function Container11() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[64px] items-start relative shrink-0 w-full" data-name="Container">
      <Label />
      <Button3 />
    </div>
  );
}

function Label1() {
  return (
    <div className="content-stretch flex h-[20px] items-center relative shrink-0 w-full" data-name="Label">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic relative shrink-0 text-[#0a0a0a] text-[14px]">Đoạn mã mẫu</p>
    </div>
  );
}

function Button4() {
  return (
    <div className="bg-white h-[36px] relative rounded-[8px] shrink-0 w-full" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[65.5px] not-italic text-[#0a0a0a] text-[14px] text-center top-[7px]">Vòng lặp Items</p>
    </div>
  );
}

function Container12() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[64px] items-start relative shrink-0 w-full" data-name="Container">
      <Label1 />
      <Button4 />
    </div>
  );
}

function P2() {
  return (
    <div className="absolute content-stretch flex h-[16px] items-start left-[12px] top-[12px] w-[261px]" data-name="p">
      <p className="flex-[1_0_0] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] min-h-px min-w-px not-italic relative text-[#1c398e] text-[12px] whitespace-pre-wrap">💡 Hướng dẫn:</p>
    </div>
  );
}

function Li() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="li">
      <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[16px] min-h-px min-w-px not-italic relative text-[#193cb8] text-[12px] whitespace-pre-wrap">Biến sẽ tự động thay thế khi in</p>
    </div>
  );
}

function Li1() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="li">
      <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[16px] min-h-px min-w-px not-italic relative text-[#193cb8] text-[12px] whitespace-pre-wrap">{`Dùng {{#Items}}...{{/Items}} cho vòng lặp`}</p>
    </div>
  );
}

function Li2() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="li">
      <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[16px] min-h-px min-w-px not-italic relative text-[#193cb8] text-[12px] whitespace-pre-wrap">Không xóa cú pháp biến</p>
    </div>
  );
}

function Ul() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] h-[56px] items-start left-[28px] top-[36px] w-[245px]" data-name="ul">
      <Li />
      <Li1 />
      <Li2 />
    </div>
  );
}

function CardContent() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[285px]" data-name="CardContent">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <P2 />
        <Ul />
      </div>
    </div>
  );
}

function Card() {
  return (
    <div className="bg-[#eff6ff] content-stretch flex flex-col h-[118px] items-start p-px relative rounded-[14px] shrink-0 w-full" data-name="Card">
      <div aria-hidden="true" className="absolute border border-[#bedbff] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <CardContent />
    </div>
  );
}

function Container10() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] h-[278px] items-start relative shrink-0 w-full" data-name="Container">
      <Container11 />
      <Container12 />
      <Card />
    </div>
  );
}

function Container9() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[319px]" data-name="Container">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[16px] px-[16px] relative size-full">
          <Container10 />
        </div>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[319px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container8 />
        <Container9 />
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="bg-white h-[785px] relative shrink-0 w-[320px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0.1)] border-r border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pr-px relative size-full">
        <Container7 />
      </div>
    </div>
  );
}

function Label2() {
  return (
    <div className="content-stretch flex h-[14px] items-center relative shrink-0 w-full" data-name="Label">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[14px] not-italic relative shrink-0 text-[#0a0a0a] text-[14px]">Tên mẫu in</p>
    </div>
  );
}

function Input() {
  return (
    <div className="bg-[#f3f3f5] h-[36px] relative rounded-[8px] shrink-0 w-full" data-name="Input">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center px-[12px] py-[4px] relative size-full">
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#717182] text-[14px]">Mẫu hóa đơn mới</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Container17() {
  return (
    <div className="flex-[1_0_0] h-[58px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-start relative size-full">
        <Label2 />
        <Input />
      </div>
    </div>
  );
}

function Label3() {
  return (
    <div className="content-stretch flex h-[14px] items-center relative shrink-0 w-full" data-name="Label">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[14px] not-italic relative shrink-0 text-[#0a0a0a] text-[14px]">Chế độ xem</p>
    </div>
  );
}

function Layout() {
  return (
    <div className="absolute left-[10px] size-[16px] top-[8px]" data-name="Layout">
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

function Button5() {
  return (
    <div className="flex-[1_0_0] h-[32px] min-h-px min-w-px relative rounded-[8px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Layout />
        <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[59.5px] not-italic text-[#0a0a0a] text-[14px] text-center top-[5px]">Visual</p>
      </div>
    </div>
  );
}

function Code() {
  return (
    <div className="absolute left-[10px] size-[16px] top-[8px]" data-name="Code2">
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

function Button6() {
  return (
    <div className="bg-white flex-[1_0_0] h-[32px] min-h-px min-w-px relative rounded-[8px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Code />
        <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[59px] not-italic text-[#0a0a0a] text-[14px] text-center top-[5px]">HTML</p>
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="bg-[#f9fafb] h-[42px] relative rounded-[10px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[4px] items-center px-[5px] py-px relative size-full">
          <Button5 />
          <Button6 />
        </div>
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="h-[64px] relative shrink-0 w-[189.625px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-start relative size-full">
        <Label3 />
        <Container19 />
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="content-stretch flex gap-[16px] h-[64px] items-center relative shrink-0 w-full" data-name="Container">
      <Container17 />
      <Container18 />
    </div>
  );
}

function Settings() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Settings">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p2338cf00} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p28db2b80} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Span1() {
  return (
    <div className="flex-[1_0_0] h-[20px] min-h-px min-w-px relative" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[#0a0a0a] text-[14px] text-center">Cài đặt khổ giấy</p>
      </div>
    </div>
  );
}

function Div1() {
  return (
    <div className="h-[20px] relative shrink-0 w-[126.469px]" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Settings />
        <Span1 />
      </div>
    </div>
  );
}

function ChevronDown1() {
  return (
    <div className="relative size-[16px]" data-name="ChevronDown">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M4 6L8 10L12 6" id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button7() {
  return (
    <div className="bg-white h-[32px] relative rounded-[8px] shrink-0 w-full" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[11px] py-px relative size-full">
          <Div1 />
          <div className="flex items-center justify-center relative shrink-0">
            <div className="flex-none rotate-180">
              <ChevronDown1 />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Label4() {
  return (
    <div className="content-stretch flex h-[16px] items-center relative shrink-0 w-full" data-name="Label">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#0a0a0a] text-[12px]">Khổ giấy</p>
    </div>
  );
}

function SelectValue() {
  return (
    <div className="h-[20px] relative shrink-0 w-[18px]" data-name="SelectValue">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center overflow-clip relative rounded-[inherit] size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[#0a0a0a] text-[14px] text-center">A4 (210×297mm)</p>
      </div>
    </div>
  );
}

function ChevronDownIcon() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="ChevronDownIcon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon" opacity="0.5">
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

function Container20() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[60px] items-start left-0 top-0 w-[68px]" data-name="Container">
      <Label4 />
      <SelectTrigger />
    </div>
  );
}

function Label5() {
  return (
    <div className="content-stretch flex h-[16px] items-center relative shrink-0 w-full" data-name="Label">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#0a0a0a] text-[12px]">Hướng giấy</p>
    </div>
  );
}

function SelectValue1() {
  return (
    <div className="h-[20px] relative shrink-0 w-[18px]" data-name="SelectValue">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center overflow-clip relative rounded-[inherit] size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[#0a0a0a] text-[14px] text-center">Dọc</p>
      </div>
    </div>
  );
}

function ChevronDownIcon1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="ChevronDownIcon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon" opacity="0.5">
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

function Container21() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[60px] items-start left-[80px] top-0 w-[68px]" data-name="Container">
      <Label5 />
      <SelectTrigger1 />
    </div>
  );
}

function Label6() {
  return (
    <div className="content-stretch flex h-[16px] items-center relative shrink-0 w-full" data-name="Label">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#0a0a0a] text-[12px]">Lề trang (mm)</p>
    </div>
  );
}

function Input1() {
  return (
    <div className="bg-[#f3f3f5] col-1 justify-self-stretch relative rounded-[8px] row-1 self-stretch shrink-0" data-name="Input">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center px-[12px] py-[4px] relative size-full">
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#717182] text-[14px]">20</p>
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
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#717182] text-[14px]">20</p>
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
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#717182] text-[14px]">20</p>
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
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#717182] text-[14px]">20</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Container23() {
  return (
    <div className="gap-x-[8px] gap-y-[8px] grid grid-cols-[repeat(4,minmax(0,1fr))] grid-rows-[repeat(1,minmax(0,1fr))] h-[36px] relative shrink-0 w-full" data-name="Container">
      <Input1 />
      <Input2 />
      <Input3 />
      <Input4 />
    </div>
  );
}

function Container22() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[60px] items-start left-[160px] top-0 w-[148px]" data-name="Container">
      <Label6 />
      <Container23 />
    </div>
  );
}

function Div2() {
  return (
    <div className="h-[60px] relative shrink-0 w-full" data-name="div">
      <Container20 />
      <Container21 />
      <Container22 />
    </div>
  );
}

function Collapsible() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] h-[104px] items-start relative shrink-0 w-full" data-name="Collapsible">
      <Button7 />
      <Div2 />
    </div>
  );
}

function Container15() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] h-[184px] items-start relative shrink-0 w-full" data-name="Container">
      <Container16 />
      <Collapsible />
    </div>
  );
}

function Container14() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[217px] items-start left-0 pb-px pt-[16px] px-[16px] top-0 w-[340px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0.1)] border-b border-solid inset-0 pointer-events-none" />
      <Container15 />
    </div>
  );
}

function Container26() {
  return <div className="absolute h-[18px] left-0 top-0 w-[257px]" data-name="Container" />;
}

function TextArea() {
  return <div className="absolute h-[48px] left-0 top-[18px] w-[162px]" data-name="Text Area" />;
}

function Container27() {
  return <div className="absolute h-0 left-0 top-[72px] w-[340px]" data-name="Container" />;
}

function Container28() {
  return <div className="absolute h-0 left-0 top-[72px] w-[340px]" data-name="Container" />;
}

function Container29() {
  return <div className="absolute h-0 left-0 top-[72px] w-[340px]" data-name="Container" />;
}

function Container25() {
  return (
    <div className="h-[568px] relative shrink-0 w-full" data-name="Container">
      <Container26 />
      <TextArea />
      <Container27 />
      <Container28 />
      <Container29 />
    </div>
  );
}

function Container30() {
  return <div className="h-0 shrink-0 w-full" data-name="Container" />;
}

function Container31() {
  return <div className="h-0 shrink-0 w-full" data-name="Container" />;
}

function Container24() {
  return (
    <div className="absolute content-stretch flex flex-col h-[568px] items-start left-0 top-0 w-[340px]" data-name="Container">
      <Container25 />
      <Container30 />
      <Container31 />
    </div>
  );
}

function Container33() {
  return <div className="absolute h-[3618px] left-0 top-0 w-0" data-name="Container" />;
}

function Container34() {
  return <div className="absolute left-0 size-0 top-[3618px]" data-name="Container" />;
}

function Container37() {
  return <div className="absolute h-0 left-0 top-0 w-[62px]" data-name="Container" />;
}

function Container38() {
  return (
    <div className="absolute h-[18px] left-0 top-0 w-[36px]" data-name="Container">
      <p className="absolute font-['Consolas:Regular',sans-serif] leading-[18px] left-0 not-italic text-[#0a0a0a] text-[13px] top-0">1</p>
    </div>
  );
}

function Container36() {
  return (
    <div className="absolute h-[18px] left-0 top-0 w-[62px]" data-name="Container">
      <Container37 />
      <Container38 />
    </div>
  );
}

function Container39() {
  return <div className="absolute h-0 left-0 top-[18px] w-[62px]" data-name="Container" />;
}

function Container40() {
  return <div className="absolute h-0 left-0 top-[36px] w-[62px]" data-name="Container" />;
}

function Container42() {
  return <div className="absolute h-[18px] left-0 top-0 w-[26px]" data-name="Container" />;
}

function Container43() {
  return (
    <div className="absolute h-[18px] left-0 top-[18px] w-[36px]" data-name="Container">
      <p className="absolute font-['Consolas:Regular',sans-serif] leading-[18px] left-0 not-italic text-[#0a0a0a] text-[13px] top-0">2</p>
    </div>
  );
}

function Container41() {
  return (
    <div className="absolute h-[18px] left-0 top-[54px] w-[62px]" data-name="Container">
      <Container42 />
      <Container43 />
    </div>
  );
}

function Container44() {
  return <div className="absolute h-[18px] left-0 top-[72px] w-[62px]" data-name="Container" />;
}

function Container45() {
  return <div className="absolute h-[18px] left-0 top-[90px] w-[62px]" data-name="Container" />;
}

function Container46() {
  return <div className="absolute h-[18px] left-0 top-[108px] w-[62px]" data-name="Container" />;
}

function Container47() {
  return (
    <div className="absolute h-[18px] left-0 top-[126px] w-[36px]" data-name="Container">
      <p className="absolute font-['Consolas:Regular',sans-serif] leading-[18px] left-0 not-italic text-[#0a0a0a] text-[13px] top-0">3</p>
    </div>
  );
}

function Container48() {
  return <div className="absolute h-[18px] left-0 top-[144px] w-[62px]" data-name="Container" />;
}

function Container49() {
  return <div className="absolute h-[18px] left-0 top-[162px] w-[62px]" data-name="Container" />;
}

function Container50() {
  return <div className="absolute h-[18px] left-0 top-[180px] w-[62px]" data-name="Container" />;
}

function Container51() {
  return (
    <div className="absolute h-[18px] left-0 top-[198px] w-[36px]" data-name="Container">
      <p className="absolute font-['Consolas:Regular',sans-serif] leading-[18px] left-0 not-italic text-[#0a0a0a] text-[13px] top-0">4</p>
    </div>
  );
}

function Container52() {
  return <div className="absolute h-[18px] left-0 top-[216px] w-[62px]" data-name="Container" />;
}

function Container53() {
  return (
    <div className="absolute h-[18px] left-0 top-[234px] w-[36px]" data-name="Container">
      <p className="absolute font-['Consolas:Regular',sans-serif] leading-[18px] left-0 not-italic text-[#0a0a0a] text-[13px] top-0">5</p>
    </div>
  );
}

function Container54() {
  return <div className="absolute h-[18px] left-0 top-[252px] w-[62px]" data-name="Container" />;
}

function Container55() {
  return <div className="absolute h-[18px] left-0 top-[270px] w-[62px]" data-name="Container" />;
}

function Container56() {
  return (
    <div className="absolute h-[18px] left-0 top-[288px] w-[36px]" data-name="Container">
      <p className="absolute font-['Consolas:Regular',sans-serif] leading-[18px] left-0 not-italic text-[#0a0a0a] text-[13px] top-0">6</p>
    </div>
  );
}

function Container57() {
  return <div className="absolute h-[18px] left-0 top-[306px] w-[62px]" data-name="Container" />;
}

function Container58() {
  return (
    <div className="absolute h-[18px] left-0 top-[324px] w-[36px]" data-name="Container">
      <p className="absolute font-['Consolas:Regular',sans-serif] leading-[18px] left-0 not-italic text-[#0a0a0a] text-[13px] top-0">7</p>
    </div>
  );
}

function Container59() {
  return (
    <div className="absolute h-[18px] left-0 top-[342px] w-[36px]" data-name="Container">
      <p className="absolute font-['Consolas:Regular',sans-serif] leading-[18px] left-0 not-italic text-[#0a0a0a] text-[13px] top-0">8</p>
    </div>
  );
}

function Container61() {
  return <div className="absolute h-[18px] left-0 top-0 w-[26px]" data-name="Container" />;
}

function Container62() {
  return (
    <div className="absolute h-[18px] left-0 top-[18px] w-[36px]" data-name="Container">
      <p className="absolute font-['Consolas:Regular',sans-serif] leading-[18px] left-0 not-italic text-[#0a0a0a] text-[13px] top-0">9</p>
    </div>
  );
}

function Container60() {
  return (
    <div className="absolute h-[18px] left-0 top-[360px] w-[62px]" data-name="Container">
      <Container61 />
      <Container62 />
    </div>
  );
}

function Container63() {
  return <div className="absolute h-[18px] left-0 top-[378px] w-[62px]" data-name="Container" />;
}

function Container64() {
  return <div className="absolute h-[18px] left-0 top-[396px] w-[62px]" data-name="Container" />;
}

function Container65() {
  return <div className="absolute h-[18px] left-0 top-[414px] w-[62px]" data-name="Container" />;
}

function Container66() {
  return <div className="absolute h-[18px] left-0 top-[432px] w-[62px]" data-name="Container" />;
}

function Container67() {
  return <div className="absolute h-[18px] left-0 top-[450px] w-[62px]" data-name="Container" />;
}

function Container68() {
  return <div className="absolute h-[18px] left-0 top-[468px] w-[62px]" data-name="Container" />;
}

function Container69() {
  return (
    <div className="absolute h-[18px] left-0 top-[486px] w-[36px]" data-name="Container">
      <p className="absolute font-['Consolas:Regular',sans-serif] leading-[18px] left-0 not-italic text-[#0a0a0a] text-[13px] top-0">10</p>
    </div>
  );
}

function Container70() {
  return <div className="absolute h-[18px] left-0 top-[504px] w-[62px]" data-name="Container" />;
}

function Container71() {
  return <div className="absolute h-[18px] left-0 top-[522px] w-[62px]" data-name="Container" />;
}

function Container72() {
  return (
    <div className="absolute h-[18px] left-0 top-[540px] w-[36px]" data-name="Container">
      <p className="absolute font-['Consolas:Regular',sans-serif] leading-[18px] left-0 not-italic text-[#0a0a0a] text-[13px] top-0">11</p>
    </div>
  );
}

function Container73() {
  return <div className="absolute h-[18px] left-0 top-[558px] w-[62px]" data-name="Container" />;
}

function Container35() {
  return (
    <div className="absolute h-[3618px] left-0 top-[3618px] w-[62px]" data-name="Container">
      <Container36 />
      <Container39 />
      <Container40 />
      <Container41 />
      <Container44 />
      <Container45 />
      <Container46 />
      <Container47 />
      <Container48 />
      <Container49 />
      <Container50 />
      <Container51 />
      <Container52 />
      <Container53 />
      <Container54 />
      <Container55 />
      <Container56 />
      <Container57 />
      <Container58 />
      <Container59 />
      <Container60 />
      <Container63 />
      <Container64 />
      <Container65 />
      <Container66 />
      <Container67 />
      <Container68 />
      <Container69 />
      <Container70 />
      <Container71 />
      <Container72 />
      <Container73 />
    </div>
  );
}

function Container74() {
  return <div className="absolute left-0 size-0 top-0" data-name="Container" />;
}

function Container32() {
  return (
    <div className="absolute h-[3618px] left-0 top-0 w-[62px]" data-name="Container">
      <Container33 />
      <Container34 />
      <Container35 />
      <Container74 />
    </div>
  );
}

function Container77() {
  return <div className="absolute h-0 left-0 top-0 w-[16777216px]" data-name="Container" />;
}

function Container79() {
  return <div className="absolute border-2 border-[#eee] border-solid h-[4px] left-0 top-0 w-[278px]" data-name="Container" />;
}

function Container80() {
  return <div className="absolute h-0 left-0 top-[18px] w-[278px]" data-name="Container" />;
}

function Container81() {
  return <div className="absolute h-0 left-0 top-[36px] w-[278px]" data-name="Container" />;
}

function Container82() {
  return <div className="absolute h-[18px] left-0 top-[54px] w-[278px]" data-name="Container" />;
}

function Container83() {
  return <div className="absolute h-[18px] left-0 top-[72px] w-[278px]" data-name="Container" />;
}

function Container84() {
  return <div className="absolute h-[18px] left-0 top-[90px] w-[278px]" data-name="Container" />;
}

function Container85() {
  return <div className="absolute h-[18px] left-0 top-[108px] w-[278px]" data-name="Container" />;
}

function Container86() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0)] h-0 left-0 top-[126px] w-[7.141px]" data-name="Container">
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_1px_0px_0px_0px_#d3d3d3]" />
    </div>
  );
}

function Container87() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0)] h-0 left-0 top-[144px] w-[7.141px]" data-name="Container">
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_1px_0px_0px_0px_#d3d3d3]" />
    </div>
  );
}

function Container88() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0)] h-0 left-0 top-[162px] w-[7.141px]" data-name="Container">
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_1px_0px_0px_0px_#d3d3d3]" />
    </div>
  );
}

function Container89() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0)] h-0 left-0 top-[180px] w-[7.141px]" data-name="Container">
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_1px_0px_0px_0px_#d3d3d3]" />
    </div>
  );
}

function Container90() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0)] h-0 left-0 top-[198px] w-[7.141px]" data-name="Container">
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_1px_0px_0px_0px_#d3d3d3]" />
    </div>
  );
}

function Container91() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0)] h-0 left-0 top-[216px] w-[7.141px]" data-name="Container">
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_1px_0px_0px_0px_#d3d3d3]" />
    </div>
  );
}

function Container92() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0)] h-0 left-0 top-[234px] w-[7.141px]" data-name="Container">
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_1px_0px_0px_0px_#d3d3d3]" />
    </div>
  );
}

function Container93() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0)] h-0 left-0 top-[252px] w-[7.141px]" data-name="Container">
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_1px_0px_0px_0px_#d3d3d3]" />
    </div>
  );
}

function Container94() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0)] h-0 left-0 top-[270px] w-[7.141px]" data-name="Container">
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_1px_0px_0px_0px_#d3d3d3]" />
    </div>
  );
}

function Container95() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0)] h-0 left-0 top-[288px] w-[7.141px]" data-name="Container">
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_1px_0px_0px_0px_#d3d3d3]" />
    </div>
  );
}

function Container96() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0)] h-0 left-0 top-[306px] w-[7.141px]" data-name="Container">
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_1px_0px_0px_0px_#d3d3d3]" />
    </div>
  );
}

function Container97() {
  return <div className="absolute h-[18px] left-0 top-[324px] w-[278px]" data-name="Container" />;
}

function Container98() {
  return <div className="absolute h-[18px] left-0 top-[342px] w-[278px]" data-name="Container" />;
}

function Container99() {
  return <div className="absolute h-[18px] left-0 top-[360px] w-[278px]" data-name="Container" />;
}

function Container100() {
  return <div className="absolute h-[18px] left-0 top-[378px] w-[278px]" data-name="Container" />;
}

function Container101() {
  return <div className="absolute h-[18px] left-0 top-[396px] w-[278px]" data-name="Container" />;
}

function Container102() {
  return <div className="absolute h-[18px] left-0 top-[414px] w-[278px]" data-name="Container" />;
}

function Container103() {
  return <div className="absolute h-[18px] left-0 top-[432px] w-[278px]" data-name="Container" />;
}

function Container104() {
  return <div className="absolute h-[18px] left-0 top-[450px] w-[278px]" data-name="Container" />;
}

function Container105() {
  return <div className="absolute h-[18px] left-0 top-[468px] w-[278px]" data-name="Container" />;
}

function Container106() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0)] h-0 left-0 top-[486px] w-[7.141px]" data-name="Container">
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_1px_0px_0px_0px_#d3d3d3]" />
    </div>
  );
}

function Container107() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0)] h-0 left-0 top-[504px] w-[7.141px]" data-name="Container">
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_1px_0px_0px_0px_#d3d3d3]" />
    </div>
  );
}

function Container108() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0)] h-0 left-0 top-[522px] w-[7.141px]" data-name="Container">
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_1px_0px_0px_0px_#d3d3d3]" />
    </div>
  );
}

function Container109() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0)] h-0 left-0 top-[540px] w-[7.141px]" data-name="Container">
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_1px_0px_0px_0px_#d3d3d3]" />
    </div>
  );
}

function Container110() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0)] h-0 left-0 top-[558px] w-[7.141px]" data-name="Container">
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_1px_0px_0px_0px_#d3d3d3]" />
    </div>
  );
}

function Container78() {
  return (
    <div className="absolute h-0 left-0 top-0 w-[278px]" data-name="Container">
      <Container79 />
      <Container80 />
      <Container81 />
      <Container82 />
      <Container83 />
      <Container84 />
      <Container85 />
      <Container86 />
      <Container87 />
      <Container88 />
      <Container89 />
      <Container90 />
      <Container91 />
      <Container92 />
      <Container93 />
      <Container94 />
      <Container95 />
      <Container96 />
      <Container97 />
      <Container98 />
      <Container99 />
      <Container100 />
      <Container101 />
      <Container102 />
      <Container103 />
      <Container104 />
      <Container105 />
      <Container106 />
      <Container107 />
      <Container108 />
      <Container109 />
      <Container110 />
    </div>
  );
}

function Container111() {
  return <div className="absolute left-0 size-0 top-0" data-name="Container" />;
}

function Container113() {
  return (
    <div className="absolute h-[18px] left-0 top-0 w-[278px]" data-name="Container">
      <p className="absolute font-['Consolas:Regular',sans-serif] leading-[18px] left-0 not-italic text-[13px] text-black top-0">{`<div style="padding: 20px 20px 20px `}</p>
    </div>
  );
}

function Container114() {
  return (
    <div className="absolute h-[18px] left-0 top-[18px] w-[278px]" data-name="Container">
      <p className="absolute font-['Consolas:Regular',sans-serif] leading-[18px] left-0 not-italic text-[13px] text-black top-0">{`20px; font-family: Inter, `}</p>
    </div>
  );
}

function Container115() {
  return (
    <div className="absolute h-[18px] left-0 top-[36px] w-[278px]" data-name="Container">
      <p className="absolute font-['Consolas:Regular',sans-serif] leading-[18px] left-0 not-italic text-[13px] text-black top-0">{`sans-serif;">`}</p>
    </div>
  );
}

function Container116() {
  return (
    <div className="absolute h-[18px] left-0 top-[54px] w-[278px]" data-name="Container">
      <p className="absolute font-['Consolas:Regular',sans-serif] leading-[18px] left-0 not-italic text-[13px] text-black top-0">{`<div style="margin-top: 0px; `}</p>
    </div>
  );
}

function Container117() {
  return (
    <div className="absolute h-[18px] left-0 top-[72px] w-[278px]" data-name="Container">
      <p className="absolute font-['Consolas:Regular',sans-serif] leading-[18px] left-0 not-italic text-[13px] text-black top-0">{`margin-bottom: 20px; padding-top: `}</p>
    </div>
  );
}

function Container118() {
  return (
    <div className="absolute h-[18px] left-0 top-[90px] w-[278px]" data-name="Container">
      <p className="absolute font-['Consolas:Regular',sans-serif] leading-[18px] left-0 not-italic text-[13px] text-black top-0">{`0px; padding-bottom: 0px; `}</p>
    </div>
  );
}

function Container119() {
  return (
    <div className="absolute h-[18px] left-0 top-[108px] w-[278px]" data-name="Container">
      <p className="absolute font-['Consolas:Regular',sans-serif] leading-[18px] left-0 not-italic text-[13px] text-black top-0">{`text-align: center;">`}</p>
    </div>
  );
}

function Container120() {
  return (
    <div className="absolute h-[18px] left-0 top-[126px] w-[278px]" data-name="Container">
      <p className="absolute font-['Consolas:Regular',sans-serif] leading-[18px] left-0 not-italic text-[13px] text-black top-0">{`<h1 style="color: #1E88E5; `}</p>
    </div>
  );
}

function Container121() {
  return (
    <div className="absolute h-[18px] left-0 top-[144px] w-[278px]" data-name="Container">
      <p className="absolute font-['Consolas:Regular',sans-serif] leading-[18px] left-0 not-italic text-[13px] text-black top-0">{`margin: 0; font-size: 24px; `}</p>
    </div>
  );
}

function Container122() {
  return (
    <div className="absolute h-[18px] left-0 top-[162px] w-[278px]" data-name="Container">
      <p className="absolute font-['Consolas:Regular',sans-serif] leading-[18px] left-0 not-italic text-[13px] text-black top-0">{`font-weight: bold;">{Ten_Cong_Ty}`}</p>
    </div>
  );
}

function Container123() {
  return (
    <div className="absolute h-[18px] left-0 top-[180px] w-[278px]" data-name="Container">
      <p className="absolute font-['Consolas:Regular',sans-serif] leading-[18px] left-0 not-italic text-[13px] text-black top-0">{`</h1>`}</p>
    </div>
  );
}

function Container124() {
  return (
    <div className="absolute h-[18px] left-0 top-[198px] w-[278px]" data-name="Container">
      <p className="absolute font-['Consolas:Regular',sans-serif] leading-[18px] left-0 not-italic text-[13px] text-black top-0">{`<p style="margin: 5px 0;">`}</p>
    </div>
  );
}

function Container125() {
  return (
    <div className="absolute h-[18px] left-0 top-[216px] w-[278px]" data-name="Container">
      <p className="absolute font-['Consolas:Regular',sans-serif] leading-[18px] left-0 not-italic text-[13px] text-black top-0">{`{Dia_Chi_Cong_Ty}</p>`}</p>
    </div>
  );
}

function Container126() {
  return (
    <div className="absolute h-[18px] left-0 top-[234px] w-[278px]" data-name="Container">
      <p className="absolute font-['Consolas:Regular',sans-serif] leading-[18px] left-0 not-italic text-[13px] text-black top-0">{`<p style="margin: 5px 0;">ĐT: `}</p>
    </div>
  );
}

function Container127() {
  return (
    <div className="absolute h-[18px] left-0 top-[252px] w-[278px]" data-name="Container">
      <p className="absolute font-['Consolas:Regular',sans-serif] leading-[18px] left-0 not-italic text-[13px] text-black top-0">{`{So_Dien_Thoai_Cong_Ty} • Email: `}</p>
    </div>
  );
}

function Container128() {
  return (
    <div className="absolute h-[18px] left-0 top-[270px] w-[278px]" data-name="Container">
      <p className="absolute font-['Consolas:Regular',sans-serif] leading-[18px] left-0 not-italic text-[13px] text-black top-0">{`{Email_Cong_Ty}</p>`}</p>
    </div>
  );
}

function Container129() {
  return (
    <div className="absolute h-[18px] left-0 top-[288px] w-[278px]" data-name="Container">
      <p className="absolute font-['Consolas:Regular',sans-serif] leading-[18px] left-0 not-italic text-[13px] text-black top-0">{`<p style="margin: 5px 0;">MST: `}</p>
    </div>
  );
}

function Container130() {
  return (
    <div className="absolute h-[18px] left-0 top-[306px] w-[278px]" data-name="Container">
      <p className="absolute font-['Consolas:Regular',sans-serif] leading-[18px] left-0 not-italic text-[13px] text-black top-0">{`{Ma_So_Thue_Cong_Ty}</p>`}</p>
    </div>
  );
}

function Container131() {
  return (
    <div className="absolute h-[18px] left-0 top-[324px] w-[278px]" data-name="Container">
      <p className="absolute font-['Consolas:Regular',sans-serif] leading-[18px] left-0 not-italic text-[13px] text-black top-0">{`</div>`}</p>
    </div>
  );
}

function Text() {
  return <div className="absolute left-0 size-0 top-[342px]" data-name="Text" />;
}

function Container132() {
  return (
    <div className="absolute h-[18px] left-0 top-[360px] w-[278px]" data-name="Container">
      <p className="absolute font-['Consolas:Regular',sans-serif] leading-[18px] left-0 not-italic text-[13px] text-black top-0">{`<div style="margin-top: 20px; `}</p>
    </div>
  );
}

function Container133() {
  return (
    <div className="absolute h-[18px] left-0 top-[378px] w-[278px]" data-name="Container">
      <p className="absolute font-['Consolas:Regular',sans-serif] leading-[18px] left-0 not-italic text-[13px] text-black top-0">{`margin-bottom: 20px; padding-top: `}</p>
    </div>
  );
}

function Container134() {
  return (
    <div className="absolute h-[18px] left-0 top-[396px] w-[278px]" data-name="Container">
      <p className="absolute font-['Consolas:Regular',sans-serif] leading-[18px] left-0 not-italic text-[13px] text-black top-0">{`0px; padding-bottom: 0px; `}</p>
    </div>
  );
}

function Container135() {
  return (
    <div className="absolute h-[18px] left-0 top-[414px] w-[278px]" data-name="Container">
      <p className="absolute font-['Consolas:Regular',sans-serif] leading-[18px] left-0 not-italic text-[13px] text-black top-0">{`border-top: 2px solid #1E88E5; `}</p>
    </div>
  );
}

function Container136() {
  return (
    <div className="absolute h-[18px] left-0 top-[432px] w-[278px]" data-name="Container">
      <p className="absolute font-['Consolas:Regular',sans-serif] leading-[18px] left-0 not-italic text-[13px] text-black top-0">{`border-bottom: 2px solid #1E88E5; `}</p>
    </div>
  );
}

function Container137() {
  return (
    <div className="absolute h-[18px] left-0 top-[450px] w-[278px]" data-name="Container">
      <p className="absolute font-['Consolas:Regular',sans-serif] leading-[18px] left-0 not-italic text-[13px] text-black top-0">padding: 15px 0; text-align: center;</p>
    </div>
  );
}

function Container138() {
  return (
    <div className="absolute h-[18px] left-0 top-[468px] w-[278px]" data-name="Container">
      <p className="absolute font-['Consolas:Regular',sans-serif] leading-[18px] left-0 not-italic text-[13px] text-black top-0">{`">`}</p>
    </div>
  );
}

function Container139() {
  return (
    <div className="absolute h-[18px] left-0 top-[486px] w-[278px]" data-name="Container">
      <p className="absolute font-['Consolas:Regular',sans-serif] leading-[18px] left-0 not-italic text-[13px] text-black top-0">{`<h2 style="margin: 0; font-size: `}</p>
    </div>
  );
}

function Container140() {
  return (
    <div className="absolute h-[18px] left-0 top-[504px] w-[278px]" data-name="Container">
      <p className="absolute font-['Consolas:Regular',sans-serif] leading-[18px] left-0 not-italic text-[13px] text-black top-0">{`24px; font-weight: bold;">HÓA ĐƠN `}</p>
    </div>
  );
}

function Container141() {
  return (
    <div className="absolute h-[18px] left-0 top-[522px] w-[278px]" data-name="Container">
      <p className="absolute font-['Consolas:Regular',sans-serif] leading-[18px] left-0 not-italic text-[13px] text-black top-0">{`BÁN HÀNG</h2>`}</p>
    </div>
  );
}

function Container142() {
  return (
    <div className="absolute h-[18px] left-0 top-[540px] w-[278px]" data-name="Container">
      <p className="absolute font-['Consolas:Regular',sans-serif] leading-[18px] left-0 not-italic text-[13px] text-black top-0">{`<p style="margin: 10px 0; color: `}</p>
    </div>
  );
}

function Container143() {
  return (
    <div className="absolute h-[18px] left-0 top-[558px] w-[278px]" data-name="Container">
      <p className="absolute font-['Consolas:Regular',sans-serif] leading-[18px] left-0 not-italic text-[13px] text-black top-0">{`#1E88E5; font-weight: bold;">`}</p>
    </div>
  );
}

function Container112() {
  return (
    <div className="absolute h-[3618px] left-0 top-0 w-[278px]" data-name="Container">
      <Container113 />
      <Container114 />
      <Container115 />
      <Container116 />
      <Container117 />
      <Container118 />
      <Container119 />
      <Container120 />
      <Container121 />
      <Container122 />
      <Container123 />
      <Container124 />
      <Container125 />
      <Container126 />
      <Container127 />
      <Container128 />
      <Container129 />
      <Container130 />
      <Container131 />
      <Text />
      <Container132 />
      <Container133 />
      <Container134 />
      <Container135 />
      <Container136 />
      <Container137 />
      <Container138 />
      <Container139 />
      <Container140 />
      <Container141 />
      <Container142 />
      <Container143 />
    </div>
  );
}

function Container144() {
  return <div className="absolute left-0 size-0 top-0" data-name="Container" />;
}

function Container76() {
  return (
    <div className="absolute left-0 overflow-clip size-[16777216px] top-0" data-name="Container">
      <Container77 />
      <Container78 />
      <Container111 />
      <Container112 />
      <Container144 />
    </div>
  );
}

function Canvas() {
  return (
    <div className="absolute h-[568px] left-[264px] top-0 w-[14px]" data-name="Canvas">
      <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full" src={imgCanvas} />
    </div>
  );
}

function Container75() {
  return (
    <div className="absolute h-[568px] left-[62px] overflow-clip top-[72px] w-[278px]" data-name="Container">
      <Container76 />
      <Canvas />
    </div>
  );
}

function Container146() {
  return <div className="h-[568px] shrink-0 w-full" data-name="Container" />;
}

function Container147() {
  return <div className="h-0 shrink-0 w-full" data-name="Container" />;
}

function Container145() {
  return (
    <div className="absolute content-stretch flex flex-col h-[568px] items-start left-0 top-[72px] w-0" data-name="Container">
      <Container146 />
      <Container147 />
    </div>
  );
}

function Ee() {
  return (
    <div className="absolute bg-[#f3f4f6] h-[568px] left-0 overflow-clip top-[217px] w-[340px]" data-name="Ee">
      <Container24 />
      <Container32 />
      <Container75 />
      <Container145 />
    </div>
  );
}

function Container13() {
  return (
    <div className="flex-[1_0_0] h-[785px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <Container14 />
        <Ee />
      </div>
    </div>
  );
}

function H3() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="h3">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[28px] left-0 not-italic text-[#101828] text-[18px] top-[-1px]">Xem trước trực tiếp</p>
    </div>
  );
}

function P3() {
  return (
    <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="p">
      <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[20px] min-h-px min-w-px not-italic relative text-[#6a7282] text-[14px] whitespace-pre-wrap">Cập nhật tự động</p>
    </div>
  );
}

function Container151() {
  return (
    <div className="h-[48px] relative shrink-0 w-[159.859px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <H3 />
        <P3 />
      </div>
    </div>
  );
}

function Container150() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between pr-[408.141px] relative size-full">
          <Container151 />
        </div>
      </div>
    </div>
  );
}

function Container149() {
  return (
    <div className="bg-white h-[81px] relative shrink-0 w-[600px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0.1)] border-b border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-px pt-[16px] px-[16px] relative size-full">
        <Container150 />
      </div>
    </div>
  );
}

function Svg() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="svg">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p3161fe80} id="Vector" stroke="var(--stroke-0, #155DFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Container157() {
  return (
    <div className="bg-[#dbeafe] relative rounded-[4px] shrink-0 size-[32px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Svg />
      </div>
    </div>
  );
}

function P4() {
  return (
    <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="p">
      <p className="flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[20px] min-h-px min-w-px not-italic relative text-[#101828] text-[14px] whitespace-pre-wrap">A4 - Dọc</p>
    </div>
  );
}

function P5() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="p">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#6a7282] text-[12px]">210mm × 297mm</p>
    </div>
  );
}

function Container158() {
  return (
    <div className="flex-[1_0_0] h-[36px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <P4 />
        <P5 />
      </div>
    </div>
  );
}

function Container156() {
  return (
    <div className="h-[36px] relative shrink-0 w-[138.953px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
        <Container157 />
        <Container158 />
      </div>
    </div>
  );
}

function P6() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="p">
      <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[16px] min-h-px min-w-px not-italic relative text-[#6a7282] text-[12px] text-right whitespace-pre-wrap">Lề (TPDT)</p>
    </div>
  );
}

function P7() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="p">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#364153] text-[12px] text-right">20/20/20/20mm</p>
    </div>
  );
}

function Container159() {
  return (
    <div className="h-[32px] relative shrink-0 w-[89.484px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <P6 />
        <P7 />
      </div>
    </div>
  );
}

function Container155() {
  return (
    <div className="bg-white h-[60px] relative rounded-[10px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[12px] relative size-full">
          <Container156 />
          <Container159 />
        </div>
      </div>
    </div>
  );
}

function Container161() {
  return <div className="absolute border-2 border-[#bedbff] border-solid h-[759.469px] left-0 top-0 w-[537px]" data-name="Container" />;
}

function Container162() {
  return (
    <div className="absolute bg-[#2b7fff] content-stretch flex h-[24px] items-start left-[8px] px-[8px] py-[4px] rounded-[4px] top-[8px] w-[102.406px]" data-name="Container">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[12px] text-white">Vùng an toàn in</p>
    </div>
  );
}

function Heading() {
  return (
    <div className="h-[36px] relative shrink-0 w-full" data-name="Heading 1">
      <p className="-translate-x-1/2 absolute font-['Inter:Bold',sans-serif] font-bold leading-[36px] left-[228.84px] not-italic text-[#1e88e5] text-[24px] text-center top-[-1px]">CỬA HÀNG VLXD XƯƠNG LUÂN</p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[18px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[228.59px] not-italic text-[#0a0a0a] text-[12px] text-center top-0">123 Đường Võ Văn Tần, Quận 3, TP.HCM</p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[18px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[228.58px] not-italic text-[#0a0a0a] text-[12px] text-center top-0">ĐT: 028 1234 5678 • Email: info@vlxdxuonglan.vn</p>
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="h-[18px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[228.88px] not-italic text-[#0a0a0a] text-[12px] text-center top-0">MST: 0123456789</p>
    </div>
  );
}

function Container165() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[5px] h-[105px] items-start left-[20px] top-[20px] w-[457px]" data-name="Container">
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
      <p className="-translate-x-1/2 absolute font-['Inter:Bold',sans-serif] font-bold leading-[36px] left-[228.92px] not-italic text-[#0a0a0a] text-[24px] text-center top-[-1px]">HÓA ĐƠN BÁN HÀNG</p>
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="h-[18px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Inter:Bold',sans-serif] font-bold leading-[18px] left-[228.64px] not-italic text-[#1e88e5] text-[12px] text-center top-0">HD-001</p>
    </div>
  );
}

function Container166() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[10px] h-[108px] items-start left-[20px] pb-[2px] pt-[17px] top-[145px] w-[457px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#1e88e5] border-b-2 border-solid border-t-2 inset-0 pointer-events-none" />
      <Heading1 />
      <Paragraph3 />
    </div>
  );
}

function Paragraph4() {
  return (
    <div className="col-1 justify-self-stretch relative row-1 self-stretch shrink-0" data-name="Paragraph">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[0] left-0 not-italic text-[#0a0a0a] text-[0px] text-[12px] top-0">
        <span className="leading-[18px]">Ngày tạo:</span>
        <span className="font-['Inter:Regular',sans-serif] font-normal leading-[18px]">{` 24/02/2026`}</span>
      </p>
    </div>
  );
}

function Paragraph5() {
  return (
    <div className="col-2 justify-self-stretch relative row-1 self-stretch shrink-0" data-name="Paragraph">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[0] left-0 not-italic text-[#0a0a0a] text-[0px] text-[12px] top-0">
        <span className="leading-[18px]">Ngày đến hạn:</span>
        <span className="font-['Inter:Regular',sans-serif] font-normal leading-[18px]">{` 26/03/2026`}</span>
      </p>
    </div>
  );
}

function Container167() {
  return (
    <div className="absolute gap-x-[20px] gap-y-[20px] grid grid-cols-[repeat(2,minmax(0,1fr))] grid-rows-[repeat(1,minmax(0,1fr))] h-[18px] left-[20px] top-[273px] w-[457px]" data-name="Container">
      <Paragraph4 />
      <Paragraph5 />
    </div>
  );
}

function Paragraph6() {
  return (
    <div className="h-[18px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[0] left-0 not-italic text-[#0a0a0a] text-[0px] text-[12px] top-0">
        <span className="leading-[18px]">Khách hàng:</span>
        <span className="font-['Inter:Regular',sans-serif] font-normal leading-[18px]">{` Anh Hòa Q.1`}</span>
      </p>
    </div>
  );
}

function Paragraph7() {
  return (
    <div className="h-[18px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[0] left-0 not-italic text-[#0a0a0a] text-[0px] text-[12px] top-0">
        <span className="leading-[18px]">Địa chỉ:</span>
        <span className="font-['Inter:Regular',sans-serif] font-normal leading-[18px]">{` 456 Đường Lê Lợi, Quận 1, TP.HCM`}</span>
      </p>
    </div>
  );
}

function Paragraph8() {
  return (
    <div className="h-[18px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[0] left-0 not-italic text-[#0a0a0a] text-[0px] text-[12px] top-0">
        <span className="leading-[18px]">Điện thoại:</span>
        <span className="font-['Inter:Regular',sans-serif] font-normal leading-[18px]">{` 0901 234 567`}</span>
      </p>
    </div>
  );
}

function Container168() {
  return (
    <div className="absolute content-stretch flex flex-col h-[54px] items-start left-[20px] top-[311px] w-[457px]" data-name="Container">
      <Paragraph6 />
      <Paragraph7 />
      <Paragraph8 />
    </div>
  );
}

function HeaderCell() {
  return (
    <div className="absolute border border-[#ddd] border-solid h-[39px] left-0 top-0 w-[44.906px]" data-name="Header Cell">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[18px] left-[9.5px] not-italic text-[12px] text-white top-[9.5px]">STT</p>
    </div>
  );
}

function HeaderCell1() {
  return (
    <div className="absolute border border-[#ddd] border-solid h-[39px] left-[44.91px] top-0 w-[132.688px]" data-name="Header Cell">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[18px] left-[9.5px] not-italic text-[12px] text-white top-[9.5px]">Tên hàng</p>
    </div>
  );
}

function HeaderCell2() {
  return (
    <div className="absolute border border-[#ddd] border-solid h-[39px] left-[177.59px] top-0 w-[49.359px]" data-name="Header Cell">
      <p className="-translate-x-1/2 absolute font-['Inter:Bold',sans-serif] font-bold leading-[18px] left-[23.81px] not-italic text-[12px] text-center text-white top-[9.5px]">ĐVT</p>
    </div>
  );
}

function HeaderCell3() {
  return (
    <div className="absolute border border-[#ddd] border-solid h-[39px] left-[226.95px] top-0 w-[37.578px]" data-name="Header Cell">
      <p className="-translate-x-full absolute font-['Inter:Bold',sans-serif] font-bold leading-[18px] left-[26.41px] not-italic text-[12px] text-right text-white top-[9.5px]">SL</p>
    </div>
  );
}

function HeaderCell4() {
  return (
    <div className="absolute border border-[#ddd] border-solid h-[39px] left-[264.53px] top-0 w-[93.422px]" data-name="Header Cell">
      <p className="-translate-x-full absolute font-['Inter:Bold',sans-serif] font-bold leading-[18px] left-[82.53px] not-italic text-[12px] text-right text-white top-[9.5px]">Đơn giá</p>
    </div>
  );
}

function HeaderCell5() {
  return (
    <div className="absolute border border-[#ddd] border-solid h-[39px] left-[357.95px] top-0 w-[98.047px]" data-name="Header Cell">
      <p className="-translate-x-full absolute font-['Inter:Bold',sans-serif] font-bold leading-[18px] left-[86.77px] not-italic text-[12px] text-right text-white top-[9.5px]">Thành tiền</p>
    </div>
  );
}

function TableRow() {
  return (
    <div className="absolute bg-[#1e88e5] h-[39px] left-0 top-0 w-[456px]" data-name="Table Row">
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
    <div className="absolute h-[39px] left-[0.5px] top-[0.5px] w-[456px]" data-name="Table Header">
      <TableRow />
    </div>
  );
}

function TableCell() {
  return (
    <div className="absolute border border-[#ddd] border-solid h-[53px] left-0 top-0 w-[44.906px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[7.5px] not-italic text-[#0a0a0a] text-[12px] top-[16.5px]">1</p>
    </div>
  );
}

function TableCell1() {
  return (
    <div className="absolute border border-[#ddd] border-solid h-[53px] left-[44.91px] top-0 w-[132.688px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[7.5px] not-italic text-[#0a0a0a] text-[12px] top-[7.5px] w-[96px] whitespace-pre-wrap">Ván nhựa Alcado 20cm x 3m</p>
    </div>
  );
}

function TableCell2() {
  return (
    <div className="absolute border border-[#ddd] border-solid h-[53px] left-[177.59px] top-0 w-[49.359px]" data-name="Table Cell">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[23.66px] not-italic text-[#0a0a0a] text-[12px] text-center top-[16.5px]">Tấm</p>
    </div>
  );
}

function TableCell3() {
  return (
    <div className="absolute border border-[#ddd] border-solid h-[53px] left-[226.95px] top-0 w-[37.578px]" data-name="Table Cell">
      <p className="-translate-x-full absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[28.28px] not-italic text-[#0a0a0a] text-[12px] text-right top-[16.5px]">50</p>
    </div>
  );
}

function TableCell4() {
  return (
    <div className="absolute border border-[#ddd] border-solid h-[53px] left-[264.53px] top-0 w-[93.422px]" data-name="Table Cell">
      <p className="-translate-x-full absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[84.5px] not-italic text-[#0a0a0a] text-[12px] text-right top-[16.5px]">320.000 ₫</p>
    </div>
  );
}

function TableCell5() {
  return (
    <div className="absolute border border-[#ddd] border-solid h-[53px] left-[357.95px] top-0 w-[98.047px]" data-name="Table Cell">
      <p className="-translate-x-full absolute font-['Inter:Bold',sans-serif] font-bold leading-[18px] left-[89.08px] not-italic text-[#0a0a0a] text-[12px] text-right top-[16.5px]">16.000.000 ₫</p>
    </div>
  );
}

function TableRow1() {
  return (
    <div className="absolute h-[53px] left-0 top-0 w-[456px]" data-name="Table Row">
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
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[7.5px] not-italic text-[#0a0a0a] text-[12px] top-[16.5px]">2</p>
    </div>
  );
}

function TableCell7() {
  return (
    <div className="absolute border border-[#ddd] border-solid h-[53px] left-[44.91px] top-0 w-[132.688px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[7.5px] not-italic text-[#0a0a0a] text-[12px] top-[7.5px] w-[110px] whitespace-pre-wrap">Quần jeans nữ Blue Exchange size M</p>
    </div>
  );
}

function TableCell8() {
  return (
    <div className="absolute border border-[#ddd] border-solid h-[53px] left-[177.59px] top-0 w-[49.359px]" data-name="Table Cell">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[24px] not-italic text-[#0a0a0a] text-[12px] text-center top-[16.5px]">Cái</p>
    </div>
  );
}

function TableCell9() {
  return (
    <div className="absolute border border-[#ddd] border-solid h-[53px] left-[226.95px] top-0 w-[37.578px]" data-name="Table Cell">
      <p className="-translate-x-full absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[28.5px] not-italic text-[#0a0a0a] text-[12px] text-right top-[16.5px]">100</p>
    </div>
  );
}

function TableCell10() {
  return (
    <div className="absolute border border-[#ddd] border-solid h-[53px] left-[264.53px] top-0 w-[93.422px]" data-name="Table Cell">
      <p className="-translate-x-full absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[84.84px] not-italic text-[#0a0a0a] text-[12px] text-right top-[16.5px]">250.000 ₫</p>
    </div>
  );
}

function TableCell11() {
  return (
    <div className="absolute border border-[#ddd] border-solid h-[53px] left-[357.95px] top-0 w-[98.047px]" data-name="Table Cell">
      <p className="-translate-x-full absolute font-['Inter:Bold',sans-serif] font-bold leading-[18px] left-[89.5px] not-italic text-[#0a0a0a] text-[12px] text-right top-[16.5px]">25.000.000 ₫</p>
    </div>
  );
}

function TableRow2() {
  return (
    <div className="absolute h-[53px] left-0 top-[53px] w-[456px]" data-name="Table Row">
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
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[7.5px] not-italic text-[#0a0a0a] text-[12px] top-[16.5px]">3</p>
    </div>
  );
}

function TableCell13() {
  return (
    <div className="absolute border border-[#ddd] border-solid h-[53px] left-[44.91px] top-0 w-[132.688px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[7.5px] not-italic text-[#0a0a0a] text-[12px] top-[7.5px] w-[105px] whitespace-pre-wrap">iPhone 15 Pro Max 256GB</p>
    </div>
  );
}

function TableCell14() {
  return (
    <div className="absolute border border-[#ddd] border-solid h-[53px] left-[177.59px] top-0 w-[49.359px]" data-name="Table Cell">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[24px] not-italic text-[#0a0a0a] text-[12px] text-center top-[16.5px]">Chiếc</p>
    </div>
  );
}

function TableCell15() {
  return (
    <div className="absolute border border-[#ddd] border-solid h-[53px] left-[226.95px] top-0 w-[37.578px]" data-name="Table Cell">
      <p className="-translate-x-full absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[28.81px] not-italic text-[#0a0a0a] text-[12px] text-right top-[16.5px]">2</p>
    </div>
  );
}

function TableCell16() {
  return (
    <div className="absolute border border-[#ddd] border-solid h-[53px] left-[264.53px] top-0 w-[93.422px]" data-name="Table Cell">
      <p className="-translate-x-full absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[84.5px] not-italic text-[#0a0a0a] text-[12px] text-right top-[16.5px]">32.000.000 ₫</p>
    </div>
  );
}

function TableCell17() {
  return (
    <div className="absolute border border-[#ddd] border-solid h-[53px] left-[357.95px] top-0 w-[98.047px]" data-name="Table Cell">
      <p className="-translate-x-full absolute font-['Inter:Bold',sans-serif] font-bold leading-[18px] left-[88.89px] not-italic text-[#0a0a0a] text-[12px] text-right top-[16.5px]">4.200.000 ₫</p>
    </div>
  );
}

function TableRow3() {
  return (
    <div className="absolute h-[53px] left-0 top-[106px] w-[456px]" data-name="Table Row">
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
    <div className="absolute h-[159px] left-[0.5px] top-[39.5px] w-[456px]" data-name="Table Body">
      <TableRow1 />
      <TableRow2 />
      <TableRow3 />
    </div>
  );
}

function Table() {
  return (
    <div className="absolute h-[199px] left-[20px] top-[385px] w-[457px]" data-name="Table">
      <TableHeader />
      <TableBody />
    </div>
  );
}

function Text1() {
  return (
    <div className="h-[18px] relative shrink-0 w-[52.031px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-0 not-italic text-[#0a0a0a] text-[12px] top-0">Tạm tính:</p>
      </div>
    </div>
  );
}

function Text2() {
  return (
    <div className="h-[18px] relative shrink-0 w-[76.266px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-0 not-italic text-[#0a0a0a] text-[12px] top-0">45.200.000 ₫</p>
      </div>
    </div>
  );
}

function Container171() {
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
    <div className="h-[27px] relative shrink-0 w-[116.516px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[27px] left-0 not-italic text-[#1e88e5] text-[18px] top-px">TỔNG CỘNG:</p>
      </div>
    </div>
  );
}

function Text4() {
  return (
    <div className="h-[27px] relative shrink-0 w-[121.922px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[27px] left-0 not-italic text-[#1e88e5] text-[18px] top-px">45.200.000 ₫</p>
      </div>
    </div>
  );
}

function Container172() {
  return (
    <div className="content-stretch flex h-[45px] items-start justify-between pb-[2px] pt-[8px] relative shrink-0 w-full" data-name="Container">
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
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-0 not-italic text-[12px] text-[green] top-0">Đã thanh toán:</p>
      </div>
    </div>
  );
}

function Text6() {
  return (
    <div className="h-[18px] relative shrink-0 w-[76.359px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-0 not-italic text-[12px] text-[green] top-0">30.000.000 ₫</p>
      </div>
    </div>
  );
}

function Container173() {
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
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[18px] left-0 not-italic text-[12px] text-[orange] top-0">Còn lại:</p>
      </div>
    </div>
  );
}

function Text8() {
  return (
    <div className="h-[18px] relative shrink-0 w-[79.031px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[18px] left-0 not-italic text-[12px] text-[orange] top-0">15.200.000 ₫</p>
      </div>
    </div>
  );
}

function Container174() {
  return (
    <div className="content-stretch flex h-[34px] items-start justify-between pt-[8px] relative shrink-0 w-full" data-name="Container">
      <Text7 />
      <Text8 />
    </div>
  );
}

function Container170() {
  return (
    <div className="h-[148px] relative shrink-0 w-[300px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container171 />
        <Container172 />
        <Container173 />
        <Container174 />
      </div>
    </div>
  );
}

function Container169() {
  return (
    <div className="absolute content-stretch flex h-[148px] items-start justify-end left-[20px] top-[614px] w-[457px]" data-name="Container">
      <Container170 />
    </div>
  );
}

function Paragraph9() {
  return (
    <div className="h-[18px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Inter:Bold',sans-serif] font-bold leading-[18px] left-[104.3px] not-italic text-[#0a0a0a] text-[12px] text-center top-0">Người bán hàng</p>
    </div>
  );
}

function Paragraph10() {
  return (
    <div className="h-[18px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[104.7px] not-italic text-[#999] text-[12px] text-center top-0">(Ký và ghi rõ họ tên)</p>
    </div>
  );
}

function Container176() {
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
      <p className="-translate-x-1/2 absolute font-['Inter:Bold',sans-serif] font-bold leading-[18px] left-[104.45px] not-italic text-[#0a0a0a] text-[12px] text-center top-0">Khách hàng</p>
    </div>
  );
}

function Paragraph12() {
  return (
    <div className="h-[18px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[104.7px] not-italic text-[#999] text-[12px] text-center top-0">(Ký và ghi rõ họ tên)</p>
    </div>
  );
}

function Container177() {
  return (
    <div className="col-2 content-stretch flex flex-col gap-[60px] items-start justify-self-stretch relative row-1 self-stretch shrink-0" data-name="Container">
      <Paragraph11 />
      <Paragraph12 />
    </div>
  );
}

function Container175() {
  return (
    <div className="absolute gap-x-[40px] gap-y-[40px] grid grid-cols-[repeat(2,minmax(0,1fr))] grid-rows-[repeat(1,minmax(0,1fr))] h-[96px] left-[20px] top-[812px] w-[457px]" data-name="Container">
      <Container176 />
      <Container177 />
    </div>
  );
}

function Paragraph13() {
  return (
    <div className="absolute h-[18px] left-[20px] top-[938px] w-[457px]" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Inter:Italic',sans-serif] font-normal italic leading-[18px] left-[228.83px] text-[#666] text-[12px] text-center top-0">Cảm ơn quý khách đã tin tưởng sử dụng sản phẩm của chúng tôi!</p>
    </div>
  );
}

function Container164() {
  return (
    <div className="h-[976px] relative shrink-0 w-full" data-name="Container">
      <Container165 />
      <Container166 />
      <Container167 />
      <Container168 />
      <Table />
      <Container169 />
      <Container175 />
      <Paragraph13 />
    </div>
  );
}

function Container163() {
  return (
    <div className="absolute content-stretch flex flex-col h-[759.469px] items-start left-0 overflow-clip pt-[20px] px-[20px] top-0 w-[537px]" data-name="Container">
      <Container164 />
    </div>
  );
}

function Container160() {
  return (
    <div className="bg-white h-[759.469px] relative shadow-[0px_25px_50px_0px_rgba(0,0,0,0.25)] shrink-0 w-full" data-name="Container">
      <Container161 />
      <Container162 />
      <Container163 />
    </div>
  );
}

function Container180() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[12px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-2 border-[#bedbff] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Span2() {
  return (
    <div className="flex-[1_0_0] h-[16px] min-h-px min-w-px relative" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#4a5565] text-[12px]">Lề trang</p>
      </div>
    </div>
  );
}

function Container179() {
  return (
    <div className="h-[16px] relative shrink-0 w-[59.422px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center relative size-full">
        <Container180 />
        <Span2 />
      </div>
    </div>
  );
}

function Container182() {
  return <div className="bg-white rounded-[4px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] shrink-0 size-[12px]" data-name="Container" />;
}

function Span3() {
  return (
    <div className="flex-[1_0_0] h-[16px] min-h-px min-w-px relative" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#4a5565] text-[12px]">Vùng in</p>
      </div>
    </div>
  );
}

function Container181() {
  return (
    <div className="h-[16px] relative shrink-0 w-[57.094px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center relative size-full">
        <Container182 />
        <Span3 />
      </div>
    </div>
  );
}

function Container178() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex gap-[16px] items-center justify-center pr-[0.016px] relative size-full">
          <Container179 />
          <Container181 />
        </div>
      </div>
    </div>
  );
}

function Container154() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[12px] h-[859.469px] items-start left-0 top-0 w-[537px]" data-name="Container">
      <Container155 />
      <Container160 />
      <Container178 />
    </div>
  );
}

function Container153() {
  return (
    <div className="h-[859.469px] relative shrink-0 w-full" data-name="Container">
      <Container154 />
    </div>
  );
}

function Container152() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[600px]" data-name="Container">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pl-[24px] pr-[39px] pt-[24px] relative size-full">
          <Container153 />
        </div>
      </div>
    </div>
  );
}

function Container148() {
  return (
    <div className="bg-[#f3f4f6] h-[785px] relative shrink-0 w-[600px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <Container149 />
        <Container152 />
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[1260px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start overflow-clip relative rounded-[inherit] size-full">
        <Container6 />
        <Container13 />
        <Container148 />
      </div>
    </div>
  );
}

function MainContent() {
  return (
    <div className="absolute bg-[#f9fafb] content-stretch flex flex-col h-[870px] items-start left-[280px] top-[24px] w-[1260px]" data-name="Main Content">
      <Container />
      <Container5 />
    </div>
  );
}

function Section() {
  return <div className="absolute h-0 left-0 top-[918px] w-[1564px]" data-name="Section" />;
}

function Div() {
  return (
    <div className="absolute bg-[#f9fafb] h-[918px] left-0 top-0 w-[1564px]" data-name="div">
      <MainContent />
      <Section />
    </div>
  );
}

function Alert() {
  return <div className="h-0 shrink-0 w-full" data-name="Alert" />;
}

function Alert1() {
  return <div className="h-0 shrink-0 w-full" data-name="Alert" />;
}

function Container184() {
  return <div className="h-0 shrink-0 w-full" data-name="Container" />;
}

function Container185() {
  return <div className="h-0 shrink-0 w-full" data-name="Container" />;
}

function Container183() {
  return (
    <div className="absolute content-stretch flex flex-col h-0 items-start left-0 top-[870px] w-[1564px]" data-name="Container">
      <Alert />
      <Alert1 />
      <Container184 />
      <Container185 />
    </div>
  );
}

function Body() {
  return (
    <div className="absolute bg-white h-[870px] left-0 top-[64px] w-[1564px]" data-name="Body">
      <Div />
      <Container183 />
    </div>
  );
}

function Input5() {
  return (
    <div className="absolute bg-[#f3f3f5] h-[36px] left-0 rounded-[8px] top-0 w-[384px]" data-name="Input">
      <div className="content-stretch flex items-center overflow-clip pl-[40px] pr-[12px] py-[4px] relative rounded-[inherit] size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#717182] text-[14px]">Tìm kiếm hóa đơn, khách hàng...</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Search() {
  return (
    <div className="absolute left-[12px] size-[16px] top-[10px]" data-name="Search">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p107a080} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M14 14L11.1333 11.1333" id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container187() {
  return (
    <div className="absolute h-[36px] left-0 top-0 w-[384px]" data-name="Container">
      <Input5 />
      <Search />
    </div>
  );
}

function Container186() {
  return (
    <div className="flex-[1_0_0] h-[36px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container187 />
      </div>
    </div>
  );
}

function User() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="User">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p399eca00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.pc93b400} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Div4() {
  return (
    <div className="bg-[#1e88e5] relative rounded-[33554400px] shrink-0 size-[32px]" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <User />
      </div>
    </div>
  );
}

function Container189() {
  return (
    <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[#0a0a0a] text-[14px]">Nguyễn Văn An</p>
    </div>
  );
}

function Container190() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[16px] min-h-px min-w-px not-italic relative text-[#6a7282] text-[12px] whitespace-pre-wrap">Quản trị viên</p>
    </div>
  );
}

function Div5() {
  return (
    <div className="h-[36px] relative shrink-0 w-[98.875px]" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container189 />
        <Container190 />
      </div>
    </div>
  );
}

function Button8() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[36px] items-center justify-center left-[52px] rounded-[8px] top-0 w-[170.875px]" data-name="Button">
      <Div4 />
      <Div5 />
    </div>
  );
}

function Bell() {
  return (
    <div className="absolute left-[10px] size-[16px] top-[10px]" data-name="Bell">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p1ce3c700} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1a06de00} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text9() {
  return <div className="absolute bg-[#ff6467] left-[-3.33px] opacity-13 rounded-[33554400px] size-[14.653px] top-[-3.33px]" data-name="Text" />;
}

function Text10() {
  return <div className="absolute bg-[#fb2c36] left-0 rounded-[33554400px] size-[8px] top-0" data-name="Text" />;
}

function Span4() {
  return (
    <div className="absolute left-[24px] size-[8px] top-[4px]" data-name="span">
      <Text9 />
      <Text10 />
    </div>
  );
}

function Button9() {
  return (
    <div className="absolute left-0 rounded-[8px] size-[36px] top-0" data-name="Button">
      <Bell />
      <Span4 />
    </div>
  );
}

function Container188() {
  return (
    <div className="h-[36px] relative shrink-0 w-[222.875px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Button8 />
        <Button9 />
      </div>
    </div>
  );
}

function Div3() {
  return (
    <div className="h-[63px] relative shrink-0 w-full" data-name="div">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[24px] relative size-full">
          <Container186 />
          <Container188 />
        </div>
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[64px] items-start left-[256px] pb-px top-0 w-[1308px]" data-name="header">
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0.1)] border-b border-solid inset-0 pointer-events-none" />
      <Div3 />
    </div>
  );
}

function FileText() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="FileText">
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

function Container192() {
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
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[36px] left-0 not-italic text-[#101828] text-[24px] top-[-2px]">Invoice Pro</p>
    </div>
  );
}

function P8() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="p">
      <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[16px] min-h-px min-w-px not-italic relative text-[#6a7282] text-[12px] whitespace-pre-wrap">Quản lý hóa đơn</p>
    </div>
  );
}

function Container193() {
  return (
    <div className="flex-[1_0_0] h-[52px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <H1 />
        <P8 />
      </div>
    </div>
  );
}

function Container191() {
  return (
    <div className="h-[52px] relative shrink-0 w-[169.266px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Container192 />
        <Container193 />
      </div>
    </div>
  );
}

function Div6() {
  return (
    <div className="absolute content-stretch flex h-[64px] items-center justify-between left-0 pb-px pl-[24px] pr-[61.734px] top-0 w-[255px]" data-name="div">
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0.1)] border-b border-solid inset-0 pointer-events-none" />
      <Container191 />
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
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[48px] not-italic text-[#364153] text-[14px] top-[11px]">Dashboard</p>
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
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[48px] not-italic text-[#364153] text-[14px] top-[11px]">Hóa đơn</p>
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
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[48px] not-italic text-[#364153] text-[14px] top-[11px]">Báo giá</p>
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
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[48px] not-italic text-[#364153] text-[14px] top-[11px]">Công nợ</p>
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
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[48px] not-italic text-[#364153] text-[14px] top-[11px]">Khách hàng</p>
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
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[48px] not-italic text-[#364153] text-[14px] top-[11px]">Mặt hàng</p>
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
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[48px] not-italic text-[#364153] text-[14px] top-[11px]">Báo cáo</p>
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
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[48px] not-italic text-[#364153] text-[14px] top-[11px]">Cài đặt</p>
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
        <g id="Icon">
          <path d="M10 12L6 8L10 4" id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Span5() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[96.06px] top-[6px] w-[52.859px]" data-name="span">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[#0a0a0a] text-[14px] text-center">Thu gọn</p>
    </div>
  );
}

function Button10() {
  return (
    <div className="absolute h-[32px] left-[16px] rounded-[8px] top-[822px] w-[223px]" data-name="Button">
      <ChevronLeft />
      <Span5 />
    </div>
  );
}

function Aside() {
  return (
    <div className="absolute bg-white border-[rgba(0,0,0,0.1)] border-r border-solid h-[870px] left-0 top-0 w-[256px]" data-name="aside">
      <Div6 />
      <Nav />
      <Button10 />
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