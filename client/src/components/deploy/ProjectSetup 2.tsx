import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useSlugAvailability } from "../../hooks/useSlugAvailability";

interface ProjectSetupProps {
  projectName: string;
  onProjectNameChange: (name: string) => void;
  isRedeploy: boolean;
  onValidationChange?: (isValid: boolean) => void;
  initialValidationOnMount?: boolean;
}

const ProjectSetup: React.FC<ProjectSetupProps> = ({
  projectName,
  onProjectNameChange,
  isRedeploy,
  onValidationChange,
  initialValidationOnMount = true,
}) => {
  const [searchParams] = useSearchParams();
  const { domainStatus } = useSlugAvailability(isRedeploy ? "" : projectName);

  // Set initial project name on component mount
  useEffect(() => {
    if (!isRedeploy && !projectName) {
      const repoName = searchParams.get("repo");
      if (repoName) {
        handleProjectNameChange(repoName.toLowerCase());
      }
    }
  }, [isRedeploy, searchParams]); // Add projectName to deps if you want to prevent overwriting

  // Validation function for project name
  const validateProjectName = (name: string) => {
    // Only allow lowercase letters, numbers, and hyphens (no underscores)
    const validPattern = /^[a-z0-9-]*$/;
    return validPattern.test(name);
  };

  // Handle project name change with validation
  const handleProjectNameChange = (value: string) => {
    onProjectNameChange(value);
    updateValidation(value);
  };

  // Update validation status
  const updateValidation = (name: string) => {
    if (!onValidationChange) return;

    // Check all validation conditions
    const isValid =
      name !== "" &&
      validateProjectName(name) &&
      (isRedeploy || domainStatus === "available");

    onValidationChange(isValid);
  };

  // Update validation when domain status changes
  useEffect(() => {
    updateValidation(projectName);
  }, [domainStatus]);

  // Validate on initial mount
  useEffect(() => {
    if (initialValidationOnMount) {
      updateValidation(projectName);
    }
  }, []);

  // Determine if the current project name is invalid
  const isInvalidFormat =
    projectName !== "" && !validateProjectName(projectName);

  useEffect(() => {
    if (isRedeploy) {
      // If redeploying, consider the project name valid by default
      onValidationChange?.(true);
    } else {
      // Only validate project name if not redeploying
      const isValid = validateProjectName(projectName);
      onValidationChange?.(isValid);
    }
  }, [projectName, isRedeploy, onValidationChange]);

  return (
    <>
      {/* GitHub Import Section */}
      <div className="bg-[#1a1a1a] p-3 rounded mb-6">
        <p className="text-gray-400 mb-2 tracking-wide text-sm font-semibold">
          Importing from GitHub
        </p>
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mr-2"
            fill="currentColor"
            width="20px"
            height="20px"
            viewBox="0 0 1024 1024"
          >
            <path d="M511.6 76.3C264.3 76.2 64 276.4 64 523.5 64 718.9 189.3 885 363.8 946c23.5 5.9 19.9-10.8 19.9-22.2v-77.5c-135.7 15.9-141.2-73.9-150.3-88.9C215 726 171.5 718 184.5 703c30.9-15.9 62.4 4 98.9 57.9 26.4 39.1 77.9 32.5 104 26 5.7-23.5 17.9-44.5 34.7-60.8-140.6-25.2-199.2-111-199.2-213 0-49.5 16.3-95 48.3-131.7-20.4-60.5 1.9-112.3 4.9-120 58.1-5.2 118.5 41.6 123.2 45.3 33-8.9 70.7-13.6 112.9-13.6 42.4 0 80.2 4.9 113.5 13.9 11.3-8.6 67.3-48.8 121.3-43.9 2.9 7.7 24.7 58.3 5.5 118 32.4 36.8 48.9 82.7 48.9 132.3 0 102.2-59 188.1-200 212.9a127.5 127.5 0 0 1 38.1 91v112.5c.8 9 0 17.9 15 17.9 177.1-59.7 304.6-227 304.6-424.1 0-247.2-200.4-447.3-447.5-447.3z" />
          </svg>
          <span className="text-sm font-semibold tracking-wide">
            {searchParams.get("owner") || ""}/
            {searchParams.get("repo") || searchParams.get("slug") || ""}
          </span>
        </div>
      </div>

      {/* Project Name Input Section */}
      <div className="flex mb-6">
        <div className="w-full">
          <label className="block text-gray-400 mb-2 text-[13px]">
            Project Name
          </label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => handleProjectNameChange(e.target.value)}
            placeholder={isRedeploy ? "" : "Enter project name"}
            className={`w-full bg-transparent px-[13px] py-[6px] rounded text-white border border-[#282828] focus:border-gray-400 outline-none transition-all duration-200 ${
              isRedeploy ? "opacity-70 cursor-not-allowed" : ""
            } ${isInvalidFormat ? "border-red-500" : ""}`}
            disabled={isRedeploy}
          />
          {isRedeploy && (
            <p className="text-xs text-gray-500 mt-1">
              Project name cannot be changed during redeployment.
            </p>
          )}

          {/* Format validation message */}
          {!isRedeploy && (
            <p className="text-xs text-gray-400 mt-1">
              Project name can only contain lowercase letters, numbers, and
              hyphens.
            </p>
          )}

          {/* Domain Status Messages - Only show if not redeploying */}
          {!isRedeploy && (
            <>
              {isInvalidFormat && (
                <p className="text-[13px] text-red-500 flex items-center mt-1">
                  <CrossIcon />
                  Project name can only contain lowercase letters, numbers, and
                  hyphens.
                </p>
              )}
              {domainStatus === "available" && !isInvalidFormat && (
                <p className="text-[13px] text-green-500 flex items-center mt-1">
                  <CheckIcon />
                  The domain is available.
                </p>
              )}
              {domainStatus === "unavailable" && !isInvalidFormat && (
                <p className="text-[13px] text-red-500 flex items-center mt-1">
                  <CrossIcon />
                  The domain is not available.
                </p>
              )}
              {domainStatus === "invalid" && !isInvalidFormat && (
                <p className="text-[13px] text-yellow-500 flex items-center mt-1">
                  <WarningIcon />
                  Domain name cannot contain spaces.
                </p>
              )}
              {domainStatus === "checking" && !isInvalidFormat && (
                <p className="text-[13px] text-gray-400 flex items-center mt-1">
                  <Loader2 className="animate-spin mr-1" size={14} />
                  Checking availability...
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

// Icons for domain status messages
const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4 text-green-500 mr-1"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const CrossIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4 text-red-500 mr-1"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const WarningIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4 text-yellow-500 mr-1"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
    />
  </svg>
);

export default ProjectSetup;
