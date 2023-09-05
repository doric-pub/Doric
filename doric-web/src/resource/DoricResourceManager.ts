import { Resource } from "doric";
import { DoricResourceLoader } from "./DoricResourceLoader";

export default class DoricResourceManager {
  private resourceLoaders = new Map<string, DoricResourceLoader>();

  regirsterLoader(loader: DoricResourceLoader) {
    this.resourceLoaders.set(loader.resourceType(), loader);
  }

  load(resource: Resource) {
    return this.resourceLoaders.get(resource.type)?.load(resource.identifier);
  }
}
