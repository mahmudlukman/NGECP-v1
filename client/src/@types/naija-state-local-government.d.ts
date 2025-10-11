declare module "naija-state-local-government" {
  interface NaijaStateLocalGovernment {
    states: () => string[];
    lgas: (state: string) => { state: string; lgas: string[] } | undefined;
  }

  const naijaStateLga: NaijaStateLocalGovernment;
  export default naijaStateLga;
}
