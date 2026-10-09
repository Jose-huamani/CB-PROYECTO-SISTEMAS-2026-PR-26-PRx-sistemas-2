import { ConflictException } from '@nestjs/common';
import { RegisterRequestHandler } from './register-request.handler';

describe('Registro directo con sesión', () => {
  let users: any;
  let hash: any;
  let login: any;
  let handler: RegisterRequestHandler;
  const dto = { email: 'qa@example.invalid', username: 'qa', password: 'test-only' };
  beforeEach(() => {
    users = { existsByEmail: jest.fn().mockResolvedValue(false), existsByUsername: jest.fn().mockResolvedValue(false), createSelfRegistered: jest.fn().mockResolvedValue({ id: 10 }) };
    hash = { hash: jest.fn().mockResolvedValue('hashed-test-value') };
    login = { execute: jest.fn().mockResolvedValue({ data: { accessToken: 'test-token' } }) };
    handler = new RegisterRequestHandler(users, hash, { getRandomAvatar: () => 'avatar.png' } as any, login);
  });
  it('crea con hash y devuelve la sesión sin enviar un código', async () => {
    const result = await handler.execute({ dto, userAgent: 'QA', ipAddress: '127.0.0.1' });
    expect(users.createSelfRegistered.mock.calls[0][0].passwordHash).toBe('hashed-test-value');
    expect(login.execute.mock.calls[0][0].dto.identifier).toBe(dto.email);
    expect(result.data.accessToken).toBe('test-token');
  });
  it('rechaza un correo ya registrado antes de crear datos', async () => {
    users.existsByEmail.mockResolvedValue(true);
    await expect(handler.execute({ dto })).rejects.toBeInstanceOf(ConflictException);
    expect(users.createSelfRegistered).not.toHaveBeenCalled();
  });
  it('rechaza un nombre ya utilizado', async () => {
    users.existsByUsername.mockResolvedValue(true);
    await expect(handler.execute({ dto })).rejects.toBeInstanceOf(ConflictException);
    expect(login.execute).not.toHaveBeenCalled();
  });
  it('convierte una colisión concurrente de unicidad en conflicto', async () => {
    users.createSelfRegistered.mockRejectedValue({ code: 'P2002' });
    await expect(handler.execute({ dto })).rejects.toBeInstanceOf(ConflictException);
    expect(login.execute).not.toHaveBeenCalled();
  });
  it('propaga un fallo de persistencia sin iniciar sesión', async () => {
    users.createSelfRegistered.mockRejectedValue(new Error('DB_FAILED'));
    await expect(handler.execute({ dto })).rejects.toThrow('DB_FAILED');
    expect(login.execute).not.toHaveBeenCalled();
  });
});
