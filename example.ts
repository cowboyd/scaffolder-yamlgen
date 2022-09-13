import { template } from "./mod.ts";

export default template(function*() {
  let { name, repoUrl } = yield* parameters([{
    title: 'Fill in some steps',
    properties: {
      name: {
        required: true,
        title: 'Name',
        type: 'string',
        description: 'Unique name of the component',
        "ui:autofocus:": true,
        "ui:options:": {
          rows: 5,
        }
      },
    }
  }, {
    title: 'Choose a location',
    properties: {
      repoUrl: {
        required: true,
        title: 'Repository location',
        type: 'string',
        "ui:field": "RepoUrlPicker",
        "ui:options": {
          allowedHosts: ["github.com"],
        }
      }

    }
  }]);

  yield* fetchTemplate("Fetch Base", {
    url: "./template",
    values: { name },
  });

  yield* fetchPlain("Fetch Docs", {
    targetPath: "./community",
    url: "https://github.com/backstage/community/tree/main/backstage-community-sessions"
  });

  let { repoContentsUrl } = yield* publishGithub("Publish", {
    allowedHosts: ["github.com"],
    description: `This is ${name}`,
    repoUrl,
  });

  yield* catalogRegister("Register", {
    repoContentsUrl,
    catalogInfoPath: '/catalog-info.yml',
  });
});
