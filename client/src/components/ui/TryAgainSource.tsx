import { Button } from "./LoadingBtnSource";
import Failed from "../../assets/Loading/failed.svg"
import useGitHubOAuth from "../../hooks/useAuth";
import { Link } from "react-router-dom";

export function TryAgainSource() {
    const initiateOAuth = useGitHubOAuth(import.meta.env.VITE_CLIENT_ID, "http://localhost:5000/auth/github/callback");

    return (
        <div className="flex gap-4 flex-col flex-wrap justify-center items-center h-screen">
            <div className="flex flex-col gap-3 items-center h-[450px] w-[380px] justify-center rounded-lg">

                <div>
                    <img className="w-20" src={Failed} alt="" />
                </div>
                <div >
                    Request can not be processed.
                </div>
                <div className="flex flex-col gap-2">
                    <Link to="/">
                        <Button className="bg-blue-500 text-black flex items-center gap-2 px-4 py-2 w-32">
                            <svg fill="#000000" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M629.228 331.011 0 960.239l629.228 629.228 155.901-155.901-363.071-363.071h1497.931V849.984H422.058l363.071-363.072z" fill-rule="evenodd"></path> </g></svg>
                            Back home
                        </Button>
                    </Link>
                    <Button className="bg-green-500 text-black flex items-center gap-2 px-4 py-2 w-32"
                        onClick={() => {
                            console.log('TRYING AGAIN')
                            initiateOAuth()
                        }}
                    >
                        Try again
                        <svg fill="#000000" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M960 0v213.333c411.627 0 746.667 334.934 746.667 746.667S1371.627 1706.667 960 1706.667 213.333 1371.733 213.333 960c0-197.013 78.4-382.507 213.334-520.747v254.08H640V106.667H53.333V320h191.04C88.64 494.08 0 720.96 0 960c0 529.28 430.613 960 960 960s960-430.72 960-960S1489.387 0 960 0" fill-rule="evenodd"></path> </g></svg>
                    </Button>
                </div>
            </div>
        </div>
    );
}
