import { CSSProperties, Fragment, useEffect, useId, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import clsx from 'clsx';

import { ReactComponent as PaletteIcon } from '@/assets/icons/palette.svg';
import { ReactComponent as DarkIcon } from '@/assets/icons/dark_mode.svg';
import { ReactComponent as LightIcon } from '@/assets/icons/light_mode.svg';

import colors from 'tailwindcss/colors';
import { KeysMatching } from '@/typeHelpers';

const BLACK_LIST_COLORS = [
  'lightBlue',
  'warmGray',
  'trueGray',
  'coolGray',
  'blueGray',
];
const colorChoices = Object.entries(colors).filter(
  ([name, c]) => typeof c !== 'string' && !BLACK_LIST_COLORS.includes(name),
);

type Colors = KeysMatching<typeof colors, Record<string, unknown>>;

export default function SettingsModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const id = useId();
  const [selectedColor, setSelectedColor] = useState<Colors>('blue');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const target = document.body;
    const currentColor = [...target.classList].find((e) =>
      e.startsWith('set-theme-'),
    );
    if (currentColor) target.classList.remove(currentColor);

    target.classList.add(`set-theme-${selectedColor}`);
  }, [selectedColor]);
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  return (
    <Transition as={Fragment} show={isOpen}>
      <Dialog onClose={onClose}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-150"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        {/* Dialog body */}
        <div className="fixed inset-0 overflow-y-auto text-black dark:text-white">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-150"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-100"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-md bg-white py-6 text-left align-middle shadow-xl transition-all dark:bg-slate-700">
                <Dialog.Title className="mb-4 px-6 text-xl font-medium">
                  Settings
                </Dialog.Title>
                {/* Color Header */}
                <div className="flex items-center justify-between px-6">
                  <h3 className="text-xl font-bold">
                    <PaletteIcon
                      className="inline h-5 w-5 translate-y-[-1px] text-gray-800 dark:text-slate-200"
                      viewBox="0 0 50 50"
                    />{' '}
                    Color
                  </h3>
                  <button
                    className="group flex flex-row items-center transition-opacity hover:opacity-40"
                    onClick={() => setIsDarkMode(!isDarkMode)}
                  >
                    <h3 className="mr-2">{isDarkMode ? 'Dark' : 'Light'}</h3>
                    {isDarkMode ? (
                      <DarkIcon
                        viewBox="0 0 50 50"
                        className="h-5 w-5 transition-transform group-hover:rotate-[20deg] dark:text-slate-200"
                      />
                    ) : (
                      <LightIcon
                        viewBox="0 0 50 50"
                        className="h-5 w-5 transition-transform group-hover:rotate-[20deg] dark:text-slate-200"
                      />
                    )}
                  </button>
                </div>
                <div className="w-[calc(100% - 0.75rem)] mx-3 mt-2 h-px bg-gray-300 dark:bg-slate-500" />
                {/* Color body */}
                <fieldset
                  className="mt-3 grid grid-flow-col grid-rows-5 gap-4 px-6"
                  name="color-theme"
                >
                  {colorChoices.map(([name, color]) => (
                    <div key={name} className="flex flex-row items-center">
                      {/* <input /> */}
                      <input
                        type="radio"
                        value={name}
                        name="color-theme"
                        className={`
                          after:scale-40 relative h-5 w-5 rounded-full transition
                          after:absolute
                          after:inset-0 after:left-1/2 after:top-1/2 after:block
                          after:h-3 after:w-3 after:translate-x-[-50%] after:translate-y-[-50%] after:rounded-full
                          after:bg-current after:content-[''] checked:!bg-transparent dark:ring-offset-0
                        `}
                        style={
                          {
                            color: color['500'],
                            background:
                              selectedColor === name ? 'white' : color['500'],
                            borderColor: color['300'],
                            '--tw-ring-color': isDarkMode
                              ? color['400']
                              : color['600'],
                          } as CSSProperties
                        }
                        id={id + name}
                        onChange={() => setSelectedColor(name as Colors)}
                        checked={selectedColor === name}
                      ></input>
                      <label
                        className={clsx(
                          'ml-1.5',
                          selectedColor === name && 'underline',
                        )}
                        style={{
                          color: isDarkMode ? color['300'] : color['800'],
                        }}
                        htmlFor={id + name}
                      >
                        {name}
                      </label>
                    </div>
                  ))}
                </fieldset>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
