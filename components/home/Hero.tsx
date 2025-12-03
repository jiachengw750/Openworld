
import React from 'react';

export const Hero: React.FC = () => {
  return (
    <section className="relative pt-24 pb-28 px-6 md:px-12 border-b border-ink/10">
        <div className="max-w-[1512px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-8">
              <h1 className="font-sans text-7xl md:text-9xl leading-[0.9] tracking-tight mb-8 text-ink font-semibold">
                OpenSCI Engine
              </h1>
            </div>
            <div className="lg:col-span-4 flex flex-col justify-end">
              <p className="font-sans text-xl leading-relaxed text-ink/80 mb-10 max-w-md border-l-2 border-accent pl-8">
                OpenSCI is set to become the foundational infrastructure of future scientific research
              </p>
              <div className="flex space-x-8 font-mono text-base">
                <div className="flex flex-col">
                  <span className="text-4xl font-bold text-accent font-mono">230</span>
                  <span className="text-ink/60 uppercase text-xs tracking-widest mt-2 font-bold">Grants</span>
                </div>
                <div className="w-[1px] h-full bg-ink/10"></div>
                <div className="flex flex-col">
                  <span className="text-4xl font-bold text-accent font-mono">$12M</span>
                  <span className="text-ink/60 uppercase text-xs tracking-widest mt-2 font-bold">Donations</span>
                </div>
                <div className="w-[1px] h-full bg-ink/10"></div>
                <div className="flex flex-col">
                  <span className="text-4xl font-bold text-accent font-mono">85+</span>
                  <span className="text-ink/60 uppercase text-xs tracking-widest mt-2 font-bold">IDAs</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
  );
};