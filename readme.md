# Atlas

[![codecov](https://codecov.io/gh/atlasland/atlas/branch/main/graph/badge.svg?token=LS8A7CRD48)](https://codecov.io/gh/atlasland/atlas)

Atlas is a web application framework for Deno.

> ⚠️ This project is unstable and actively being developed. Use with caution.

## Documentation

### Installation

```shell
deno install -A -n atlas https://deno.land/x/atlas/cli.ts
```

#### Why the `--allow-all` permission?

Atlas needs the following permissions:

| Permission      | Reason                                                                  |
| --------------- | :---------------------------------------------------------------------- |
| `--allow-net`   | Atlas needs network access to accept incoming Requests                  |
| `--allow-read`  | Atlas needs read permission to read from files                          |
| `--allow-write` | Atlas needs write permission to create scaffold files with `atlas init` |
| `--allow-env`   | TBD                                                                     |
| `--allow-run`   | TBD                                                                     |

### Bootstrapping

```shell
atlas init
```

### Starting an application

```shell
atlas start
```

## Contributing

Refer to our [Contributing to Atlas](/contributing.md) guidelines.

## License

The Atlas framework is licensed under the [MIT License](/license).
