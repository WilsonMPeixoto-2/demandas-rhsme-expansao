import '@testing-library/jest-dom/vitest';
import { configure } from '@testing-library/react';

// O Windows e máquinas com I/O mais lento podem precisar de mais de 1 s para
// resolver os imports lazy após o login. O limite continua curto, mas evita
// falsos negativos sem alterar o comportamento da aplicação.
configure({ asyncUtilTimeout: 5000 });
