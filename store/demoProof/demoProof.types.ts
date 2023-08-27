export interface ProofState {
  proof: ProofMeta | null;
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
