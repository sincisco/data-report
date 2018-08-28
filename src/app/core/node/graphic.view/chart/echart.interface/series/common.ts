export interface Encode {
  tooltip?: number | string | Array<string | number>;
  itemName?: number | string | Array<string | number>;
}

export interface CartesionEncode extends Encode {
  x?: number | string | Array<string | number>;
  y?: number | string | Array<string | number>;
}

export interface PolarEncode extends Encode {
  radius?: number | string | Array<string | number>;
  angle?: number | string | Array<string | number>;
}

export interface GEOEncode extends Encode {
  lng?: number | string | Array<string | number>;
  lat?: number | string | Array<string | number>;
}
