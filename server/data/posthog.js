if (!window.posthog) {
  window.posthog = [];
  window.posthog._i = [];
  window.posthog.init = (apiKey, options, pluginName = "posthog") => {
    let posthogScript = document.createElement("script");
    posthogScript.type = "text/javascript";
    posthogScript.crossOrigin = "anonymous";
    posthogScript.async = true;
    posthogScript.src = options.api_host.replace(".i.posthog.com", "-assets.i.posthog.com") + "/static/array.js";
    document.getElementsByTagName("script")[0].parentNode.insertBefore(posthogScript, document.getElementsByTagName("script")[0]);
    ["init", "capture", "register", "register_once", "register_for_session", "unregister", "unregister_for_session", "getFeatureFlag", "getFeatureFlagPayload", "isFeatureEnabled", "reloadFeatureFlags", "updateEarlyAccessFeatureEnrollment", "getEarlyAccessFeatures", "on", "onFeatureFlags", "onSessionId", "getSurveys", "getActiveMatchingSurveys", "renderSurvey", "canRenderSurvey", "getNextSurveyStep", "identify", "setPersonProperties", "group", "resetGroups", "setPersonPropertiesForFlags", "resetPersonPropertiesForFlags", "setGroupPropertiesForFlags", "resetGroupPropertiesForFlags", "reset", "get_distinct_id", "getGroups", "get_session_id", "get_session_replay_url", "alias", "set_config", "startSessionRecording", "stopSessionRecording", "sessionRecordingStarted", "captureException", "loadToolbar", "get_property", "getSessionProperty", "createPersonProfile", "opt_in_capturing", "opt_out_capturing", "has_opted_in_capturing", "has_opted_out_capturing", "clear_opt_in_out_capturing", "debug"].forEach((method) => {
      window.posthog[method] = () => {
        window.posthog.push([method].concat(Array.from(arguments)));
      };
    });
    window.posthog._i.push([apiKey, options, pluginName]);
  };
  window.posthog.__SV = 1;
};

posthog.init("phc_VDIov4SC5IqtknFgo2ylZ6pI2mUYO3wQ28H4BqCy4CH", {
  api_host: "https://eu.i.posthog.com",
  person_profiles: "always",
});