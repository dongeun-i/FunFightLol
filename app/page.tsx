import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col py-32 px-16 bg-white dark:bg-black ">
        <div className="flex flex-col mb-10 items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            FunFight LoL
          </h1>
          <p className="max-w-md text-lg leading-6 text-zinc-600 dark:text-zinc-400">
            친구들과 함께 리그 오브 레전드를 더욱 재미있게 즐길 수 있도록 만들어진 보조 도구입니다.
          </p>
        </div>
        <div className="flex gap-4 text-base font-medium sm:flex-row mb-10">
          <input type="text" className="w-full border border-zinc-300 rounded-md p-2" placeholder="소환사명을 입력하세요" />
          <button className="shrink-0 grow-0 bg-zinc-900 text-white rounded-md p-2 hover:bg-zinc-800 cursor-pointer">찾기</button>
        </div>
        {/* summer list */}
        <div className="flex flex-row gap-4 mb-10">
          <ul className="flex flex-row h-full w-full items-center justify-between">
            <li className="flex flex-col gap-2 items-center justify-center">
              <div className="w-[100px] h-[100px] bg-zinc-300 rounded-full"></div>
              <span>Aatrox1</span>
            </li>
            <li className="flex flex-col gap-2 items-center justify-center">
              <div className="w-[100px] h-[100px] bg-zinc-300 rounded-full"></div>
              <span>Aatrox2</span>
            </li>
            <li className="flex flex-col gap-2 items-center justify-center">
              <div className="w-[100px] h-[100px] bg-zinc-300 rounded-full"></div>
              <span>Aatrox3</span>
            </li>
            <li className="flex flex-col gap-2 items-center justify-center">
              <div className="w-[100px] h-[100px] bg-zinc-300 rounded-full"></div>
              <span>Aatrox4</span>
            </li>
            <li className="flex flex-col gap-2 items-center justify-center">
              <div className="w-[100px] h-[100px] bg-zinc-300 rounded-full"></div>
              <span>Aatrox5</span>
            </li>
          </ul>
        </div>
        <button className="shrink-0 grow-0 bg-zinc-900 text-white rounded-md p-2 hover:bg-zinc-800 cursor-pointer">시작하기</button>
      </main>
    </div>
  );
}
