/**
 * Deterministic, template-based roadmap generator.
 *
 * Used whenever OPENAI_API_KEY is not set, or the OpenAI call fails. It
 * takes the missing skills (already sorted by priority upstream) and turns
 * each one into a week with concrete tasks, pulling from a per-skill task
 * bank where available and falling back to a generic but still concrete
 * template otherwise.
 */

const TASK_BANK = {
  Docker: {
    focus: "Docker fundamentals",
    tasks: [
      "Read the official Docker docs on images vs containers",
      "Write a Dockerfile for an existing Python or Node script",
      "Build the image and run the container locally",
      "Add a .dockerignore and reduce the image size",
    ],
    project: "Containerize one of your existing API projects",
    outcome: "A working Dockerfile and a container you can run with one command",
  },
  Kubernetes: {
    focus: "Kubernetes basics",
    tasks: [
      "Install a local cluster with kind or minikube",
      "Write a Deployment and a Service manifest for a containerized app",
      "Apply the manifests and expose the service locally",
      "Scale the deployment and observe pod behavior",
    ],
    project: "Deploy your containerized API to a local Kubernetes cluster",
    outcome: "A running deployment you can scale up and down manually",
  },
  AWS: {
    focus: "Core AWS services",
    tasks: [
      "Set up a free-tier AWS account and configure the CLI",
      "Deploy a small API to an EC2 instance or Elastic Beanstalk",
      "Store a file in S3 and read it back programmatically",
      "Set up basic IAM roles instead of using root credentials",
    ],
    project: "Deploy your API to AWS and connect it to an S3 bucket",
    outcome: "A live endpoint running on AWS infrastructure",
  },
  RAG: {
    focus: "Retrieval augmented generation",
    tasks: [
      "Chunk a set of documents and generate embeddings for them",
      "Store the embeddings in a vector database",
      "Write a retrieval function that returns the top matching chunks",
      "Combine retrieval results with an LLM prompt to answer questions",
    ],
    project: "Build a small document Q&A tool over a folder of PDFs or notes",
    outcome: "A working retrieval pipeline you can query with natural language",
  },
  LangChain: {
    focus: "LangChain building blocks",
    tasks: [
      "Build a basic chain that wraps a prompt and an LLM call",
      "Add a document loader and a text splitter to the chain",
      "Connect a vector store retriever to the chain",
      "Add memory so the chain keeps context across turns",
    ],
    project: "Rebuild your RAG prototype using LangChain instead of raw code",
    outcome: "A LangChain pipeline that replaces a hand-rolled retrieval flow",
  },
  FastAPI: {
    focus: "FastAPI service basics",
    tasks: [
      "Build a small API with two or three endpoints",
      "Add Pydantic models for request and response validation",
      "Add proper error handling with HTTPException",
      "Add automatic docs review using the built-in /docs page",
    ],
    project: "Wrap an existing script as a FastAPI service",
    outcome: "A documented, validated API you can call from a frontend",
  },
  "Vector Databases": {
    focus: "Vector storage and similarity search",
    tasks: [
      "Generate embeddings for a small text dataset",
      "Store them in a local vector database such as FAISS or Chroma",
      "Run a similarity search and inspect the results",
      "Compare results with different embedding models",
    ],
    project: "Add semantic search to an existing app using a vector database",
    outcome: "A working similarity search over your own dataset",
  },
  "Machine Learning": {
    focus: "Applied machine learning workflow",
    tasks: [
      "Clean and split a tabular dataset into train and test sets",
      "Train a baseline model with Scikit-learn",
      "Evaluate the model with an appropriate metric",
      "Tune at least one hyperparameter and compare results",
    ],
    project: "Train and evaluate a classifier on a public dataset",
    outcome: "A reproducible training script with a measured baseline score",
  },
  PyTorch: {
    focus: "PyTorch fundamentals",
    tasks: [
      "Build tensors and run basic operations on them",
      "Define a small neural network with nn.Module",
      "Write a training loop with a loss function and optimizer",
      "Train the model on a small dataset and plot the loss",
    ],
    project: "Train a small classifier on a toy dataset in PyTorch",
    outcome: "A training script that runs end to end and reports accuracy",
  },
  TensorFlow: {
    focus: "TensorFlow / Keras fundamentals",
    tasks: [
      "Build a sequential model with Keras layers",
      "Compile the model with a loss function and optimizer",
      "Train the model and track validation accuracy",
      "Save and reload the trained model",
    ],
    project: "Train a small classifier on a toy dataset in Keras",
    outcome: "A saved model file you can reload and run inference with",
  },
  "CI/CD": {
    focus: "Continuous integration basics",
    tasks: [
      "Write a GitHub Actions workflow that runs on every push",
      "Add a step that installs dependencies and runs tests",
      "Add a linting step to the workflow",
      "Make the workflow fail the build on test failure",
    ],
    project: "Add a CI pipeline to one of your existing repositories",
    outcome: "A green checkmark workflow that runs automatically on push",
  },
  MongoDB: {
    focus: "MongoDB fundamentals",
    tasks: [
      "Set up a local or Atlas MongoDB instance",
      "Design a schema for a small application",
      "Write basic create, read, update, delete operations",
      "Add an index and measure a query with and without it",
    ],
    project: "Add MongoDB persistence to an existing API project",
    outcome: "An API backed by a real database instead of in-memory data",
  },
  GraphQL: {
    focus: "GraphQL fundamentals",
    tasks: [
      "Define a schema with types, queries, and mutations",
      "Implement resolvers backed by an existing data source",
      "Query the API from a GraphQL playground",
      "Add basic input validation to a mutation",
    ],
    project: "Expose one of your REST endpoints as a GraphQL query instead",
    outcome: "A working GraphQL endpoint you can query with variables",
  },
  "Prompt Engineering": {
    focus: "Prompt design fundamentals",
    tasks: [
      "Write and compare zero-shot vs few-shot prompts for one task",
      "Add explicit output format instructions and test consistency",
      "Break a complex prompt into a multi-step chain",
      "Log and compare outputs across three prompt versions",
    ],
    project: "Build a small prompt test harness that logs inputs and outputs",
    outcome: "A short write-up of which prompt structure performed best and why",
  },
};

function genericTemplate(skillName) {
  return {
    focus: `${skillName} fundamentals`,
    tasks: [
      `Read the official documentation for ${skillName} and note the core concepts`,
      `Find a small existing project and add ${skillName} to it`,
      `Rebuild one part of that project using ${skillName} directly`,
      `Write a short summary of when you would choose ${skillName} and why`,
    ],
    project: `Apply ${skillName} inside one of your existing projects`,
    outcome: `A working example that uses ${skillName} in a real codebase`,
  };
}

/**
 * @param {Array<{skill: string, priority: string}>} missingSkills sorted by priority (High first)
 * @param {string} targetRole
 */
function generateFallbackRoadmap(missingSkills, targetRole) {
  const ordered = [...missingSkills].sort((a, b) => {
    const rank = { High: 0, Medium: 1, Low: 2 };
    return (rank[a.priority] ?? 3) - (rank[b.priority] ?? 3);
  });

  const weeks = ordered.slice(0, 8).map((item, index) => {
    const template = TASK_BANK[item.skill] || genericTemplate(item.skill);
    return {
      weekNumber: index + 1,
      focus: template.focus,
      skills: [item.skill],
      tasks: template.tasks,
      project: template.project,
      outcome: template.outcome,
    };
  });

  return {
    title: `${targetRole} skill roadmap`,
    explanation:
      "This roadmap is generated from the missing skills detected in your gap analysis, ordered by how often they appear in the job postings you analyzed. Each week targets one skill with concrete tasks and a small project.",
    source: "fallback",
    weeks,
  };
}

module.exports = { generateFallbackRoadmap };
