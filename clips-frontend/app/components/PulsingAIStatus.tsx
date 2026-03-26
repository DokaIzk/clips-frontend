

const PulsingAIStatus = () => {
    return (
        <div className='flex items-center flex-col '>
            <div className="fade-up-1">
                <div className="glow-ring w-19 h-19 rounded-full
                  bg-[#111814] border border-[#1d3227]
                  flex items-center justify-center">
                    <div className="icon-float">
                        <svg width="34" height="34" viewBox="0 0 34 34"
                            fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">

                            <g className="star-big">
                                <path d="M13 23C13 23 13.8 18.8 17.5 17.5C13.8 16.2 13 12 13 12
                       C13 12 12.2 16.2 8.5 17.5C12.2 18.8 13 23 13 23Z"
                                    fill="#00ff88" />
                            </g>


                            <g className="star-sm">
                                <path d="M22 14.5C22 14.5 22.5 12.2 24.5 11.5C22.5 10.8 22 8.5 22 8.5
                       C22 8.5 21.5 10.8 19.5 11.5C21.5 12.2 22 14.5 22 14.5Z"
                                    fill="#00ff88" />
                            </g>


                            <g className="star-dot">
                                <circle cx="10.5" cy="12.5" r="1.1" fill="#00ff88" opacity="0.65" />
                            </g>

                            <g className="star-mid">
                                <path d="M25 21.5C25 21.5 25.45 19.8 27 19.2C25.45 18.6 25 16.9 25 16.9
                       C25 16.9 24.55 18.6 23 19.2C24.55 19.8 25 21.5 25 21.5Z"
                                    fill="#00ff88" opacity="0.82" />
                            </g>
                        </svg>
                    </div>
                </div>
            </div>
            <h1 className="fade-up-2  text-white font-extrabold
               text-[2.1rem] sm:text-[3rem]
               leading-[1.11] tracking-[-1.2px] py-4 font-inter!">
                AI is finding viral moments...
            </h1>

          
            <p className="fade-up-3 text-lg font-normal
              tracking-[0.0em] leading-7 text-[#94A3B8]">
                Our neural network is analyzing video retention patterns
            </p>
        </div>
    )
}

export default PulsingAIStatus