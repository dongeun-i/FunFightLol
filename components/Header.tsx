export default function Header() {
  return (
    <div className="flex flex-col mb-6 sm:mb-8 md:mb-10 items-center gap-4 sm:gap-6 text-center sm:items-start sm:text-left mt-12 sm:mt-16 md:mt-0 animate-fade-in">
      <h1 className="max-w-xs text-2xl sm:text-3xl font-semibold leading-8 sm:leading-10 tracking-tight text-black dark:text-zinc-50">
        FunFight LoL
      </h1>
      <p className="max-w-md text-base sm:text-lg leading-6 text-zinc-600 dark:text-zinc-400">
        친구들과 함께 리그 오브 레전드를 더욱 재미있게 즐길 수 있도록 만들어진 보조 도구입니다.
      </p>
    </div>
  );
}

