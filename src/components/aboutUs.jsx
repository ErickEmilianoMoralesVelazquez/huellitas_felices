import React from "react";

const AboutUs = () => {
  return (
    <div id="aboutus" className="w-full py-16 px-4 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          {/* Imagen */}
          <div className="w-full md:w-1/2">
            <div className="relative aspect-[4/3] w-full">
              <img
                src="../../public/Hero2.avif"
                alt="Mascota feliz"
                className="w-full h-full object-cover rounded-2xl shadow-lg"
              />
            </div>
          </div>

          {/* Contenido */}
          <div className="w-full md:w-1/2 flex flex-col gap-6">
            <h1 className="font-bold text-2xl md:text-4xl text-center md:text-left">
              Sobre nosotros
            </h1>
            
            <div className="space-y-4 text-base md:text-lg text-gray-700">
              <p>
                En <strong className="text-[#ff6900]">Huellitas Felices</strong>,{" "}
                creemos que cada mascota merece un hogar lleno de amor y cuidado. 
                Somos una comunidad comprometida con la protección y bienestar animal, 
                dedicada a rescatar, rehabilitar y encontrar familias responsables 
                para perritos y gatitos en situación vulnerable.
              </p>
              
              <p>
                Trabajamos en conjunto con albergues, veterinarios y voluntarios
                apasionados, creando un puente entre mascotas rescatadas y personas
                dispuestas a darles una segunda oportunidad. Nuestra misión no solo
                es facilitar la adopción, sino también fomentar la tenencia
                responsable, el respeto y el cariño hacia todos los seres vivos.
              </p>
              
              <p className="font-medium">
                Porque cada huellita cuenta…
                <strong className="text-[#ff6900]">
                  ¡gracias por ser parte del cambio! 💛🐶🐱
                </strong>
              </p>
            </div>

            {/* Logo */}
            <div className="flex justify-center  md:justify-center">
              <img 
                src="../../public/ICONOO.svg" 
                alt="Logo Huellitas Felices" 
                className="w-24 md:w-32 mt-4"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
