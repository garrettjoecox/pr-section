# FS Diff

Add a filesystem diff snippet to your PRs

## Usage

### Create Workflow

Create a workflow (eg: `.github/workflows/fs-diff.yml` see [Creating a Workflow file](https://help.github.com/en/articles/configuring-a-workflow#creating-a-workflow-file)) to utilize the fs-diff action with content:

```
name: "FS Diff"
on: [pull_request]
jobs:
  fs-diff:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: garrettjoecox/fs-diff@main
        with:
          repo-token: '${{ secrets.GITHUB_TOKEN }}'
```

_Note: This grants access to the `GITHUB_TOKEN` so the action can make calls to GitHub's rest API_

#### Inputs

| Name | Description | Default |
| - | - | - |
| `repo-token` | Token to use to authorize PR changes. Typically the GITHUB_TOKEN secret | N/A |
