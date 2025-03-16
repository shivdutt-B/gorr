import React from "react";

const ImportRepoListSource = ({ repositories }) => {
    return (
        <div className=" rounded-md border border-gray-800 flex gap-2 flex-col">
            {repositories.map((repo, index) => (
                <div key={index} className="flex justify-between items-center p-5 border-b border-gray-800 last:border-0">
                    <div className="flex items-center space-x-2">
                        {repo.icon ? (
                            <span className="text-lg">{repo.icon}</span>
                        ) : (
                            <span className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center text-xs">⚫</span>
                        )}
                        <span className="text-md">
                            {repo.name} <span className="text-gray-400">· {repo.date}</span>
                        </span>
                        {repo.locked && <span className="text-gray-500">🔒</span>}
                    </div>
                    <button className="bg-white text-black text-sm font-medium px-3 py-2  rounded-[4px]">Import</button>
                </div>
            ))}
        </div>
    );
};

export default ImportRepoListSource;
