import type { AvatarMenuItemWithHandler } from "../../data/avatar-menu";

interface Props {
  item: AvatarMenuItemWithHandler;
}

export const AvatarMenuItem = ({ item }: Props) => {
  return (
    <li>
      <span onClick={item.onClick}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-5 opacity-30"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d={item.pathD} />
        </svg>
        {item.label}
      </span>
    </li>
  );
};
