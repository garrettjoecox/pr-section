# PR Section

Dynamically add markdown to your PR description in sections

## Usage

### Create Workflow

Create a workflow (eg: `.github/workflows/pr-section.yml` see [Creating a Workflow file](https://help.github.com/en/articles/configuring-a-workflow#creating-a-workflow-file)) to utilize the pr-section action with content:

```
name: "PR Section"
on: [pull_request]
jobs:
  pr-section:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: garrettjoecox/pr-section@main
        with:
          repo-token: '${{ secrets.GITHUB_TOKEN }}'
          section-name: 'storybook'
          section-value: '[Storybook link](https://storybook.example.com/${{ github.repository }}/${{ github.ref }})'
```

_Note: This grants access to the `GITHUB_TOKEN` so the action can make calls to GitHub's rest API_

#### Inputs

| Name | Description | Default |
| - | - | - |
| `repo-token`    | Token to use to authorize PR changes. Typically the GITHUB_TOKEN secret | N/A |
| `pr-number`     | PR ID to modify description of, this will default to PR that triggered  | N/A |
| `section-name`  | Section to add to PR, should be unique, will not be visible             | N/A |
| `section-value` | Value to display in this section, should be markdown compatible         | N/A |
