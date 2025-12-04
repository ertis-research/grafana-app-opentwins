<div align="center">
  <img src="https://github.com/ertis-research/opentwins/assets/48439828/74f974ba-3804-46de-9149-2c4fe7702e93" width="90" height="90" />

  <h3>OpenTwins</h3>
  <p><b>Grafana App Plugin</b></p>
  
![Grafana](https://img.shields.io/badge/Grafana-Plugin-orange?style=flat-square&logo=grafana)
![Node](https://img.shields.io/badge/node-%3E%3D%2022-brightgreen?style=flat-square&logo=nodedotjs)
![License](https://img.shields.io/badge/license-Apache%202.0-blue?style=flat-square)

</br> 
</div>

The **OpenTwins Grafana App Plugin** is a specialized front-end application designed to interface with the **[OpenTwins Platform](https://github.com/ertis-research/opentwins)**.

It provides a user-friendly Graphical User Interface (GUI) directly within Grafana, allowing users to manage Digital Twins alongside their visualization panels. This unification enables a seamless workflow where you can create, configure, and monitor the state of your Digital Twins in a single environment.

## 📋 Overview

This plugin acts primarily as a frontend client that communicates with the OpenTwins ecosystem via API calls. It relies on the following architecture:

1.  **Frontend:** This Grafana App Plugin.
2.  **Middleware:** **[Extended API for Eclipse Ditto](https://github.com/ertis-research/extended-api-for-eclipse-ditto)**. This component acts as an abstraction layer over Eclipse Ditto, adding necessary business logic and validation.
3.  **Core:** **[Eclipse Ditto](https://www.eclipse.org/ditto/)**. The core digital twin framework.

For a comprehensive understanding of the OpenTwins architecture and how this plugin integrates with the wider ecosystem, please refer to the [OpenTwins Documentation](https://ertis-research.github.io/opentwins/docs/overview/architecture).

> [!NOTE]
> Although the functionality is specific to OpenTwins, the project structure serves as a valuable template for developers building React-based Grafana App Plugins that interact with external REST APIs.

---

## 🚀 Installation

There are two ways to install this plugin: as part of the full OpenTwins platform via Kubernetes, or manually into a local Grafana instance.

### Method 1: Full Platform or Helm/Kubernetes
For a complete deployment of the OpenTwins ecosystem, please refer to the official **[OpenTwins Documentation](https://ertis-research.github.io/opentwins/docs/installation/manual/essential#grafana-v113)**. The Helm charts provided there handle the mounting of this plugin automatically. Users performing a manual installation on Kubernetes or Helm should also consult this guide for specific configuration details.

### Method 2: Local Installation
If you wish to install the plugin into an existing Grafana instance manually:

1.  **Download the Release:** Go to the [Releases](../../releases) page of this repository and download the latest `.zip` archive containing the compiled plugin.
   
2.  **Locate Plugins Folder:** Navigate to your Grafana plugins directory. Common paths are:
    * **Linux:** `/var/lib/grafana/plugins`
    * **macOS (Homebrew):** `/usr/local/var/lib/grafana/plugins`
    * **Windows:** `C:\Program Files\GrafanaLabs\grafana\data\plugins`
      
3.  **Extract:** Unzip the downloaded file into this directory.
   
4.  **Configure Grafana:** Since this is a custom plugin, you must allow Grafana to load it. Open your `grafana.ini` (or `custom.ini`) and modify the following setting under `[plugins]`:
    ```ini
    [plugins]
    allow_loading_unsigned_plugins = ertis-opentwins-app
    ```
    
5.  **Restart:** [Restart Grafana](https://grafana.com/docs/grafana/latest/setup-grafana/start-restart-grafana/) service to load the changes.
    * **Linux:** `sudo systemctl restart grafana-server`
    * **macOS:** `brew services restart grafana`
    * **Windows:** Restart the Grafana service via Task Manager or Services.
      
---

## ⚙️ Configuration

Before using the plugin, you must configure the connection to your OpenTwins/Ditto infrastructure.

1.  Navigate to **Configuration** > **Plugins** in the Grafana sidebar.
   
3.  Select **OpenTwins**.
   
5.  Click the **Configuration** tab.
   
7.  Fill in the details as described in the table below and click **Enable Plugin**.

If you make changes later, clicking **Save Configuration** will automatically reload the window to apply the new settings and authentication tokens. Ensure the "Plugin Enabled" banner appears at the top of the page.

### Configuration Fields

| **Section** | **Field** | **Description** | **Required** |
| :--- | :--- | :--- | :--- |
| **Connectivity** | **Eclipse Ditto URL** | Endpoint for the Eclipse Ditto instance (e.g., `https://ditto.example.com`). | **Yes** |
| | **Extended API URL** | Endpoint for the [Extended API](https://github.com/ertis-research/extended-api-for-eclipse-ditto) middleware component. | **Yes** |
| **Authentication** | **Standard Username** | The username for standard read/write access to digital twins. | **Yes** |
| | **Standard Password** | The password for the standard user. *Stored securely.* | **Yes** |
| | **DevOps Username** | The username for administrative/DevOps operations. | **Yes\*** |
| | **DevOps Password** | The password for the DevOps user. *Stored securely.* | **Yes\*** |
| **Experimental** | **Agents API URL** | Optional endpoint for the Agents integration (Beta, no available). | No |
| | **Agents Context** | Context identifier for the agents. | No |

***DevOps Credentials:** While the plugin may technically load without DevOps credentials, they are required for administrative features within the interface.

> [!NOTE]
> Since 2.0.0, passwords are entered via Grafana's `SecretInput` component. They are encrypted and stored securely within Grafana's database. The plugin automatically generates the necessary Basic Auth tokens (Base64 encoded) upon saving.

> [!WARNING]
> Enter the **base domain only** (e.g., `https://ditto.example.com`). Do **not** append paths such as `/api` or `/api/2` to the URL fields, as the plugin automatically handles the API context paths internally.

> [!WARNING]
> If you are running OpenTwins locally on Minikube, you must expose the services to make them accessible. Identify the `opentwins-ditto-nginx` and `opentwins-ditto-extended-api` services using `kubectl get services`. Then, run `minikube service <service-name> --url` in separate terminals to generate the accessible localhost URLs needed for the plugin configuration.

---

## 📖 Usage

For detailed instructions on how to use the interface to create and manage digital twins, please refer to the **[OpenTwins User Documentation](https://ertis-research.github.io/opentwins/docs/quickstart)**.

---

## 🛠️ Development

If you wish to extend this plugin, fix bugs, or customize the API calls, follow the steps below.

### Prerequisites
* **Node.js:** Version 22 is required.
* **Yarn:** Package manager.
* **Grafana:** A local [instance of Grafana](https://grafana.com/docs/grafana/latest/setup-grafana/installation/) running for testing.

### Setup Environment

> [!NOTE]
> Clone the repository directly into your Grafana plugins folder (e.g., `/var/lib/grafana/plugins` or `data/plugins`). Alternatively, if you choose to clone it into a custom directory, you must update the [plugins path configuration](https://grafana.com/docs/grafana/latest/setup-grafana/configure-grafana/#plugins) in your grafana.ini file to point to this location.

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/ertis-research/grafana-app-opentwins.git
    cd grafana-app-opentwins
    ```

2.  **Install Dependencies:**
    ```bash
    yarn install
    ```

3.  **Build the Project:**
    ```bash
    yarn build
    ```

4.  **Run in Development Mode:**
    This runs the compiler in watch mode.
    ```bash
    yarn dev
    ```

2.  **Edit Configuration (`grafana.ini`):**
    You must enable development mode and allow unsigned plugins.
    ```ini
    # Enable development mode to ensure changes are detected immediately
    app_mode = development

    [paths]
    # OPTIONAL: Only add this if you cloned the repo to a custom directory.
    # Point this to the parent folder where you cloned the repository.
    plugins = /path/to/your/custom/directory

    [plugins]
    # Mandatory: Allow Grafana to load this specific unsigned plugin
    allow_loading_unsigned_plugins = ertis-opentwins-app
    ```
3.  **[Restart Grafana](https://grafana.com/docs/grafana/latest/setup-grafana/start-restart-grafana/)**


### Troubleshooting: Changes Not Appearing?

1. **Restart Grafana:** In most cases, simply restarting the Grafana service is sufficient to apply your changes.

2. **Check Browser Cache:** If a restart doesn't help, try clearing your browser cache or opening Grafana in a new Incognito/Private window (or a browser you haven't used before). Browsers often cache plugin assets aggressively, so this ensures you are loading the latest version.

3. **Clear Build Cache:** If you have modified the code and the above steps do not reflect the updates, it is likely a build caching issue.

   1.  Stop the Grafana process.
      
   2.  Delete the `.cache` folder located inside `node_modules` in your project directory:
       ```bash
       rm -rf node_modules/.cache
       ```
       
   3.  Rebuild the project (`yarn build` or `yarn dev`).
      
   4.  [Restart Grafana](https://grafana.com/docs/grafana/latest/setup-grafana/start-restart-grafana/).
