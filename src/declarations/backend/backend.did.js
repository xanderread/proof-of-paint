export const idlFactory = ({ IDL }) => {
  const Main = IDL.Service({
    'greet' : IDL.Func([IDL.Text], [IDL.Text], ['query']),
    'whoAmI' : IDL.Func([], [IDL.Principal], ['query']),
  });
  return Main;
};
export const init = ({ IDL }) => {
  return [IDL.Record({ 'phrase' : IDL.Text })];
};
