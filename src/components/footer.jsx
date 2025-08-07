import React from "react";
import { Heart, Facebook, Instagram, Mail, Phone, MapPin } from "lucide-react";

const ContactItem = ({ Icon, text }) => (
  <div className="flex items-center mt-4">
    <Icon className="size-5 text-[#ff6800] mr-2" />
    <p className="text-sm text-gray-400">{text}</p>
  </div>
);

const Footer = () => {
  const contactInfo = [
    { Icon: Mail, text: "info@huellitasfelices.com" },
    { Icon: Phone, text: "(+52) 123 456 7890" },
    { Icon: MapPin, text: "Av. Mascotas Felices 123, CDMX" },
  ];

  return (
    <footer className="w-full bg-[#1e2938] text-white px-6 md:px-16 py-10">
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-10">
        {/* Sección de descripción */}
        <div className="md:w-1/2">
          <div className="flex items-center mb-4">
            <img src="../../public/Icono-blanco.svg" alt="" className="w-12 h-auto mr-2" />
            <h1 className="font-bold text-2xl">Huellitas Felices</h1>
          </div>
          <p className="text-sm text-gray-400 max-w-lg">
            Conectamos mascotas con familias amorosas desde 2024. Nuestra misión
            es crear vínculos que duren toda la vida y dar una segunda
            oportunidad a los animales que más lo necesitan.
          </p>
          <div className="flex mt-4 space-x-4">
            <Facebook className="text-gray-500 hover:text-white transition" />
            <Instagram className="text-gray-500 hover:text-white transition" />
          </div>
        </div>

        {/* Sección de contacto */}
        <div className="md:w-1/2">
          <h1 className="font-bold text-xl mb-2">Contacto</h1>
          {contactInfo.map(({ Icon, text }, idx) => (
            <ContactItem key={idx} Icon={Icon} text={text} />
          ))}
        </div>
      </div>

      {/* Línea divisoria */}
      <div className="mt-10">
        <hr className="border-gray-600 border-[0.5px]" />
      </div>

      {/* Derechos y enlaces legales */}
      <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
        <p className="text-sm text-gray-400 text-center md:text-left">
          © 2024 Huellitas Felices. Todos los derechos reservados.
        </p>
        <div className="flex space-x-6 text-sm text-gray-400">
          <p className="hover:text-white transition cursor-pointer">Privacidad</p>
          <p className="hover:text-white transition cursor-pointer">Términos y condiciones</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
