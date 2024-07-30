export class Dict {
  entries: Entry[];

  constructor() {
    this.entries = [];
  }

  get length() {
    return this.entries.length;
  }

  size() {
    return this.entries.length;
  }

  has(key: keyof Entry) {
    return this.entries.some((entry) => entry[key] === key);
  }

  set(key: keyof Entry, value: any) {
    if (!this.has(key)) this.entries.push(new Entry(value, key));
  }

  add(value: any, key: keyof Entry) {
    this.set(key, value);
  }

  putEntry(entry: Entry) {
    if (!this.has(entry.key)) {
      this.entries.push(new Entry(entry.value, entry.key));
    }
  }

  keysArray() {
    return this.entries.map((entry) => entry.key);
  }

  addEach(object: any) {
    Object.keys(object).forEach((key) => {
      this.set(key as keyof Entry, object[key]);
    });
  }

  appendDict(dict: Dict) {
    dict.entries.forEach((entry) => this.putEntry(entry));
  }

  clear() {
    this.entries = [];
  }

  delete(key: keyof Entry) {
    this.entries = this.entries.filter((entry) => entry.key !== key);
  }

  get(key: keyof Entry) {
    const found = this.entries.filter((entry) => entry[key] === key);
    return found[0] ? found[0].value : null;
  }
}

export class Entry {
  value: any;
  key: keyof Entry;

  constructor(value: any, key: keyof Entry) {
    this.value = value;
    this.key = key;
  }
}
