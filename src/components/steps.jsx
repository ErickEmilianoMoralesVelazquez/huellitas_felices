import React from "react";

const Steps = () => {
  return (
    <div className="w-full py-16 md:py-24 flex flex-col justify-center items-center bg-[#fff7ed]">
      <h1 className="text-4xl md:text-4xl font-bold">¿Cómo funciona?</h1>
      <h2 className="text-lg text-center md:text-xl text-gray-500 max-w-2xl mt-5 px-5">
        Adoptar es facíl y gratificante. Sigue estos simples pasos para
        encontrar tu compañero ideal.
      </h2>

      <div className="flex flex-col mt-12 md:mt-20 md:flex-row text-center px-4 md:px-20 gap-8 md:gap-12">

        <div className="flex flex-col items-center">
          <div className="flex flex-col justify-center items-center mb-2 p-5 bg-[#ffd6a7] rounded-full transition-all hover:rotate-y-180 duration-500 transform perspective-1000">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-12 text-[#ff6900]"
            >
              <path
                fillRule="evenodd"
                d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          <h3 className="text-lg font-semibold">Elige tu mascota</h3>
          <p className="text-md text-gray-600 md:px-6 mt-2 max-w-md">
            Explora nuestro catálogo y encuentra el compañero perfecto para ti.
          </p>
        </div>

        <div className="flex flex-col items-center">
          <div className="flex flex-col justify-center items-center mb-2 p-5  bg-[#ffd6a7] rounded-full transition-all hover:rotate-y-180 duration-500 transform perspective-1000">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-12 text-[#ff6900]"
            >
              <path d="M12.75 12.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM7.5 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM8.25 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM9.75 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM10.5 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM12.75 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM14.25 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM15 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM16.5 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM15 12.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM16.5 13.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" />
              <path
                fillRule="evenodd"
                d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5Z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold">Agenda tu visita</h3>
          <p className="text-md text-gray-600 md:px-6 mt-2 max-w-md">
            Programa una cita para conocer a tu futura mascota y asegurar la
            compatibilidad.
          </p>
        </div>
        <div className="flex flex-col items-center">
          <div className="flex flex-col justify-center items-center mb-2 p-5  bg-[#ffd6a7] rounded-full transition-all hover:rotate-y-180 duration-500 transform perspective-1000">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-12 text-[#ff6900]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold">Llévala a casa</h3>
          <p className="text-md text-gray-600 md:px-6 mt-2 max-w-md">
            Completa el proceso de adopción y dale la bienvenida a tu nuevo
            mejor amigo.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Steps;
