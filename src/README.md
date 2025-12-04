# OpenTwins App Plugin

![Grafana](https://img.shields.io/badge/Grafana-Plugin-orange?style=flat-square&logo=grafana)
![Node](https://img.shields.io/badge/node-%3E%3D%2022-brightgreen?style=flat-square&logo=nodedotjs)
![License](https://img.shields.io/badge/license-Apache%202.0-blue?style=flat-square)

The **OpenTwins App Plugin** serves as the central frontend interface for the [OpenTwins](https://github.com/ertis-research/opentwins) platform. It connects your Grafana dashboard directly to the **Eclipse Ditto** core via our Extended API, providing a unified environment to manage, compose, and monitor your Digital Twins.

## Key Features

This interface provides comprehensive management capabilities:

* **Digital Twin Management:** Full CRUD operations for Digital Twins and Digital Twin Types.
* **Instantiation:** Rapidly instantiate new Digital Twins based on existing Types.
* **Composition:** Advanced composition capabilities for both Twins and Types.
* **Integrations:**
    * **Simulations:** Integrate external simulations via API.
    * **AI/ML:** Integrate Machine Learning models using **Kafka-ML** (you must use Kafka Connection creation).
    * **Agents:** Kubernetes Agents integration (currently in beta/experimental phase).
* **Infrastructure & Security:**
    * **Connections:** Manage and debug Eclipse Ditto connections.
    * **Policies:** Full CRUD operations for access control policies.


---

## Configuration Setup

To enable the plugin, configure the endpoints and credentials below.


#### 1. Connectivity
Define the URLs for your infrastructure.

* **Eclipse Ditto URL**
    * The base URL of your Ditto instance.
    * ⚠️ **Important:** Do **not** append `/api/2` to the path.
    * *Example:* `https://ditto.example.com`

</br>

* **Extended API URL**
    * The base URL of the OpenTwins middleware (Extended API).
    * ⚠️ **Important:** Do **not** append `/api` to the path.
    * *Example:* `https://extended.example.com`


</br>

#### 2. Authentication
Enter your credentials to authorize API requests.

* **Standard Access**
    * **Usage:** Required for basic read/write operations and instantiating Digital Twins and Types.
    * **Input:** Enter the standard **username** and **password**.
    * *Example:* `ditto` and `ditto` (default credentials)

</br>

* **DevOps Access**
    * **Usage:** Required for administrative tasks: connections and policies.
    * **Input:** Enter the DevOps **username** and **password**.
    * *Example:* `devops` and `foobar` (default credentials)

</br>

*Note: Passwords are entered via Grafana's SecretInput component. They are **encrypted** and stored securely within Grafana's database. The plugin automatically generates the necessary Basic Auth tokens (Base64 encoded) upon saving.*

</br>

#### 3. **Experimental:** Agents
The **Agents API URL** and **Agents Context** fields refer to the Kubernetes Agents integration. This feature is currently **experimental** and allows for the orchestration of K8s resources directly linked to twins. If you are not actively developing this feature, you may leave these fields blank.

</br>

#### 4. Apply Changes
1.  Fill in the required fields.
2.  Click **Save Configuration**.
3.  **The window will automatically reload** to apply settings and generate authentication tokens.
4.  Verify that the **"Plugin Enabled"** banner appears at the top.

---

## Documentation & Support

* **User Guide:** For detailed instructions on how to use these features, visit the [OpenTwins Official Documentation](https://ertis-research.github.io/opentwins/docs/quickstart).
* **Source Code:** This project is Open Source. View the code or report issues on [GitHub](https://github.com/ertis-research/grafana-app-opentwins).