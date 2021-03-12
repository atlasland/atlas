# Atlas

Atlas is a web application framework for Deno.

## Documentation

### Installation

```shell
deno install --allow-all --name atlas https://deno.land/x/atlas/atlas.ts`
```

#### Why the `--allow-all` permission?

Atlas needs the following permissions:

| Permission     | Reason                                                |
| -------------- | :---------------------------------------------------- |
| `--allow-net`  | Atlas needs network access to acept incoming Requests |
| `--allow-read` |                                                       |

### Bootstrapping

`atlas init`

### Starting an application

`atlas start --port 400`

## Contributing

Refer to our [Contributing to Atlas](/contributing.md) guidelines.

## License

The Atlas framework is licensed under the [MIT License](/license).
