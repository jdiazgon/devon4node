import { JwtStrategy } from './jwt.strategy';
import { UserPayload } from '../../user/model/dto/user-payload.dto';
describe('JwtStrategy', () => {
  describe('validate', () => {
    it('should validate the payload received in the JWT token and should return it', () => {
      const jwtConfig: any = { jwtConfig: { secret: 'SECRET' } };
      const jwtStrategy = new JwtStrategy(jwtConfig);
      const inputPayload: UserPayload = { id: 0, username: 'test', role: 0 };

      expect(jwtStrategy.validate(inputPayload)).resolves.toStrictEqual(
        inputPayload,
      );
      expect(jwtStrategy.validate(inputPayload)).resolves.not.toStrictEqual({
        id: 1,
      });
    });
  });
});
