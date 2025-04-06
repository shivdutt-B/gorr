import React from 'react'

function ImportThirdPartyRepo() {
    return (
        <div className="bg-black w-full p-4 text-white rounded-xl border border-gray-800 max-w-lg  shadow-lg">
            {/* Title */}
            <h2 className="text-xl font-semibold mb-4">Import Third Party Git Repository</h2>

            {/* Dropdown & Search */}
            <div className="flex items-center space-x-2 mb-4">
                <div className="bg-gray-900 p-2 px-4 rounded-lg flex items-center justify-between w-1/2 cursor-pointer border border-gray-700">
                    <span>shivdutt-B</span>
                    <svg className="w-4 h-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
                <div className="bg-gray-900 p-2 px-4 rounded-lg flex items-center w-full border border-gray-700">
                    <svg className="w-5 h-5 text-gray-400 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 1 0-13 0 6.5 6.5 0 0 0 13 0z" />
                    </svg>
                    <input type="text" placeholder="Search..." className="bg-transparent outline-none w-full text-sm" />
                </div>
            </div>
        </div>
    )
}

export default ImportThirdPartyRepo