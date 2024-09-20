import React from "react";
import Link from "next/link";
import { ModeToggle } from "./ModeToggle";

export function Navbar() {
  return (
    <nav className='flex justify-between items-center p-4 w-full bg-background text-foreground'>
      <h1 className='text-2xl font-bold'>Pixel Shift</h1>
      <ul className='flex space-x-4 items-center'>
        <li>
          <Link
            href='https://github.com/00x2d0/pixelshift'
            className='hover:text-foreground/80'
          >
            Github
          </Link>
        </li>
        <li>
          <Link
            href='https://twitter.com/0x20d'
            className='hover:text-foreground/80'
          >
            X
          </Link>
        </li>
        <li>
          <Link
            href='https://buymeacoffee.com/0x20d/membership'
            className='hover:text-foreground/80'
          >
            Support this Project
          </Link>
        </li>
        <li>
          <ModeToggle />
        </li>
      </ul>
    </nav>
  );
}
