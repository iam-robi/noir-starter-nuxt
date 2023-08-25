export interface ProofState {
  proofs: [ProofMeta] | [];
  publicInputY: number;
  privateInputX: number;
  verifierAddress: string;
}

export type DemoArgs = {
  x: number;
  y: number;
};

export type ProofMeta = {
  data: any;
  parameters: any;
  computationTime: number;
  description: string;
};
