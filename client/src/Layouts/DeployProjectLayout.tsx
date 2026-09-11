import React, { useState, useEffect } from "react";
import EnvironmentVariables from "../components/deploy/EnvironmentVariables";
import ProjectSetup from "../components/deploy/ProjectSetup";
import GlobeVisualization from "../components/deploy/GlobeVisualization";
import { Navbar } from "../components/layout/Navbar";
import { motion, AnimatePresence } from "framer-motion";

import DirectorySelector from "../components/deploy/DirectorySelector";
import { useDeployProject } from "../hooks/useDeployProject";
import { useRedeployProject } from "../hooks/useRedeployProject";
import { useSearchParams } from "react-router-dom";
import DeploymentResponse from "../components/deploy/DeploymentResponse";

interface DeployProjectLayoutProps {
  initialValidationComplete?: boolean;
}

const DeployProjectLayout: React.FC<DeployProjectLayoutProps> = ({
  initialValidationComplete = false,
}) => {
  const [projectName, setProjectName] = useState("");
  const [isProjectNameValid, setIsProjectNameValid] = useState(false);
  const [isEnvExpanded, setIsEnvExpanded] = useState(false);
  const [envVariables, setEnvVariables] = useState([]);
  const [hasDuplicateEnvKeys, setHasDuplicateEnvKeys] = useState(false);
  const [hasValueWithoutKey, setHasValueWithoutKey] = useState(false);

  const [rootDirectory, setRootDirectory] = useState<string>("./");
  const [isDirectorySelectorOpen, setIsDirectorySelectorOpen] =
    useState<boolean>(false);

  const [searchParams] = useSearchParams();
  const isRedeploy = searchParams.get("redeploy") === "true";
  const repoSlugFromUrl = searchParams.get("slug")?.trim();

  const {
    deployProject,
    isDeploying,
    error,
    deploymentData,
    isQueued,
    queuedTimestamp,
    projectSlug,
  } = useDeployProject();

  const {
    redeployProject,
    isRedeploying,
    error: redeployError,
    deploymentData: redeployData,
    isQueued: isRedeployQueued,
    queuedTimestamp: redeployQueuedTimestamp,
  } = useRedeployProject();

  // Initialize currentProjectSlug with the slug from URL if available
  const [currentProjectSlug, setCurrentProjectSlug] = useState<
    string | undefined
  >(repoSlugFromUrl || projectSlug);

  // Set project name from URL parameter on initial load
  useEffect(() => {
    // Log all parameters from URL
    if (repoSlugFromUrl) {
      setProjectName(repoSlugFromUrl);
      setCurrentProjectSlug(repoSlugFromUrl);
    }
  }, [repoSlugFromUrl]);

  // Update currentProjectSlug when projectSlug changes from deploy
  useEffect(() => {
    if (projectSlug) {
      setCurrentProjectSlug(projectSlug.trim());
    }
  }, [projectSlug]);

  // Update currentProjectSlug when redeployData contains a project slug
  useEffect(() => {
    if (redeployData?.data?.project?.slug) {
      setCurrentProjectSlug(redeployData.data.project.slug.trim());
    }
  }, [redeployData]);

  // Check for duplicate env keys and values without keys whenever envVariables changes
  useEffect(() => {
    const keyMap = new Map();
    let hasDuplicates = false;
    let valueWithoutKey = false;

    envVariables.forEach((variable: any) => {
      if (variable.key.trim() !== "") {
        if (keyMap.has(variable.key)) {
          hasDuplicates = true;
        } else {
          keyMap.set(variable.key, true);
        }
      } else if (variable.value.trim() !== "") {
        valueWithoutKey = true;
      }
    });

    setHasDuplicateEnvKeys(hasDuplicates);
    setHasValueWithoutKey(valueWithoutKey);
  }, [envVariables]);

  // Add this useEffect to automatically validate project name for redeploy
  useEffect(() => {
    if (isRedeploy && projectName) {
      setIsProjectNameValid(true);
    }
  }, [isRedeploy, projectName]);

  useEffect(() => {
    if (isRedeploy) {
      const slugFromUrl = searchParams.get("slug");
      if (slugFromUrl) {
        setProjectName(slugFromUrl);
        setCurrentProjectSlug(slugFromUrl);
        setIsProjectNameValid(true);
      }
    }
  }, [isRedeploy, searchParams]);

  const handleDirectorySelect = (directory: string) => {
    setRootDirectory(directory);
  };

  // Handle adding new environment variable
  const addEnvVariable = () => {
    setEnvVariables([...envVariables, { key: "", value: "" }]);
  };

  // Handle removing environment variable
  const removeEnvVariable = (index: number) => {
    setEnvVariables(envVariables.filter((_, i) => i !== index));
  };

  const handleUpdateEnvVariable = (
    index: number,
    key: string,
    value: string
  ) => {
    const newVars = [...envVariables];
    newVars[index] = { key, value };
    setEnvVariables(newVars);
  };

  const handleDeploy = async () => {
    try {
      const gitURL = searchParams.get("git_url");
      const userId = searchParams.get("user_id");

      if (!gitURL) {
        throw new Error("Git URL is required");
      }

      // Use the slug from URL for redeploy, otherwise use the project name
      const slug = isRedeploy
        ? searchParams.get("slug")
        : projectName.toLowerCase().replace(/\s+/g, "-");

      // Prepare environment variables
      const formattedEnvVars = envVariables
        .map(({ key, value }) => ({
          key: key.trim(),
          value,
        }))
        .filter(({ key }) => key !== "");

      // Prepare deployment data
      const deploymentData = {
        gitURL,
        slug,
        rootDirectory,
        envVariables: formattedEnvVars,
        userId,
      };

      // Call the appropriate deployment function
      if (isRedeploy && repoSlugFromUrl) {
        await redeployProject(
          gitURL,
          repoSlugFromUrl,
          rootDirectory,
          userId,
          formattedEnvVars // as-is
        );
      } else {
        await deployProject(deploymentData); // as-is
      }
    } catch (error) {
      console.error("Deployment error:", error);
    }
  };

  // Determine which set of state variables to use based on isRedeploy
  const currentIsLoading = isRedeploy ? isRedeploying : isDeploying;
  const currentError = isRedeploy ? redeployError : error;
  const currentDeploymentData = isRedeploy ? redeployData : deploymentData;
  const currentIsQueued = isRedeploy ? isRedeployQueued : isQueued;
  const currentQueuedTimestamp = isRedeploy
    ? redeployQueuedTimestamp
    : queuedTimestamp;

  // Determine if the deploy/redeploy button should be disabled
  const isDeployButtonDisabled =
    (!isProjectNameValid && !isRedeploy) ||
    hasDuplicateEnvKeys ||
    hasValueWithoutKey ||
    isDeploying ||
    isRedeploying;

  return (
  <>
    <Navbar />

    <div className="max-w-[750px] w-full m-auto mt-36 mb-20">
      <div className="flex flex-col items-center justify-center w-full min-h-screen bg-[hsl(var(--bg))] text-[hsl(var(--text-primary))]">
        <div className="w-full bg-[hsl(var(--bg))] overflow-hidden">
          <div className="pb-8">

            <h2
              className="
                text-3xl
                font-serif
                font-normal
                mb-1
                tracking-[-0.025em]
                text-[hsl(var(--text-primary))]
              "
            >
              New{" "}
              <span className="text-accent">
                Project
              </span>
            </h2>

            {isRedeploy ? (
              <p className="text-red-500 font-normal text-[14px] mb-4">
                * Enter the env variables for the project again.
              </p>
            ) : null}

            <ProjectSetup
              projectName={projectName}
              onProjectNameChange={setProjectName}
              isRedeploy={isRedeploy}
              onValidationChange={setIsProjectNameValid}
              initialValidationOnMount={true}
            />

            {/* <div className="border-t border-white/[0.07] my-6 mt-4"></div> */}

            {/* Root Directory */}
            <div className="mb-6">
              <label className="block text-md mb-2">
                Root Directory
              </label>

              <div className="flex gap-2">
                <input
                  type="text"
                  className="
                    bg-white/[0.025]
                    border
                    border-white/[0.07]
                    p-3
                    rounded-[4px]
                    flex-grow
                    font-mono
                    text-[13px]
                    text-[hsl(var(--text-primary))]
                    outline-none
                    focus:white/30
                  "
                  value={rootDirectory}
                  readOnly
                />

                <button
                  className="
                    bg-white/[0.025]
                    border
                    border-white/[0.07]
                    px-4
                    py-2
                    rounded-[4px]
                    hover:bg-white/[0.035]
                    hover:border-white/[0.08]
                  "
                  onClick={() => setIsDirectorySelectorOpen(true)}
                >
                  Edit
                </button>
              </div>
            </div>

            <EnvironmentVariables
              envVariables={envVariables}
              isExpanded={isEnvExpanded}
              onToggleExpand={() => setIsEnvExpanded(!isEnvExpanded)}
              onAddVariable={addEnvVariable}
              onRemoveVariable={removeEnvVariable}
              onUpdateVariable={handleUpdateEnvVariable}
            />

            {/* Deploy Button */}
            <button
              className={`w-full py-3 rounded-[4px] font-medium transition duration-200 ${
                isDeployButtonDisabled
                  ? "bg-white/[0.05] text-white/25 cursor-not-allowed"
                  : "bg-accent text-black hover:bg-[hsl(var(--accent-strong))]"
              }`}
              onClick={handleDeploy}
              disabled={isDeployButtonDisabled}
              title={
                hasDuplicateEnvKeys
                  ? "Please fix duplicate environment variable keys"
                  : hasValueWithoutKey
                  ? "Each value must have a corresponding key"
                  : !isProjectNameValid
                  ? "Please enter a valid project name"
                  : ""
              }
            >
              {currentIsLoading
                ? isRedeploy
                  ? "Redeploying..."
                  : "Deploying..."
                : isRedeploy
                ? "Redeploy"
                : "Deploy"}
            </button>

            {hasDuplicateEnvKeys && (
              <p className="text-red-400/80 text-sm mt-2">
                Please fix duplicate environment variable keys before
                deploying.
              </p>
            )}

            {hasValueWithoutKey && (
              <p className="text-red-400/80 text-sm mt-2">
                Each environment variable value must have a corresponding key.
              </p>
            )}

            <DeploymentResponse
              isDeploying={currentIsLoading}
              error={currentError}
              deploymentData={currentDeploymentData}
              isQueued={currentIsQueued}
              queuedTimestamp={currentQueuedTimestamp}
            />
          </div>
        </div>

        <GlobeVisualization
          projectSlug={currentProjectSlug}
          isDeploying={currentIsLoading}
        />
      </div>

      {/* Directory Selector Modal */}
      <AnimatePresence mode="wait">
        {isDirectorySelectorOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] flex items-center justify-center"
          >
            <DirectorySelector
              onSelectDirectory={handleDirectorySelect}
              onClose={() => setIsDirectorySelectorOpen(false)}
              initialPath={rootDirectory}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  </>
);
};

export default DeployProjectLayout;
